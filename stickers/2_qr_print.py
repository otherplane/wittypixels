#!/usr/bin/env python3

import argparse
from brother_ql.backends import available_backends
from brother_ql.backends.helpers import send
from brother_ql.conversion import convert
from brother_ql.devicedependent import label_sizes, label_type_specs, models
from brother_ql.raster import BrotherQLRaster
import glob
import time
from PIL import Image, ImageFont
from PIL import ImageDraw
from typing import List, Tuple


def tell_color(path: str):
    return path.split('-')[-1].split('.')[0]


def tell_index(path: str):
    return int(path.split('-')[0].split('/')[-1])


def load_image(path: str, resolution: Tuple[int, int]):
    with Image.open(path) as image:
        extended = Image.new('1', (round(resolution[0] * 1.35), round(resolution[1] * 1.35)), 1)
        extended.paste(image, (round(resolution[0] * 0.2), 0))

        return extended.resize(resolution)


def load_images(input_dir: str, resolution: Tuple[int, int]):
    files = glob.glob(f'{input_dir}/*-*-*.png')
    images = [(tell_index(file), tell_color(file), load_image(file, resolution)) for file in files]
    images.sort(key=lambda x: x[0])

    return images


def image_with_text(text: str):
    image = Image.new('RGBA', (250, 225), 'white')
    ImageDraw.Draw(image).text((20, 10), text, (0, 0, 0), align='center')

    return image


def ql_print(image: str, label: str, backend: str, model: str, printer: str, **kwargs):
    qlr = BrotherQLRaster(model)
    qlr.exception_on_warning = True
    instructions = convert(qlr, [image], label, hq=True, **kwargs)
    return send(instructions, printer_identifier=printer, backend_identifier=backend, blocking=True)


def ql_bulk_print(images: List[str], label: str, backend: str, model: str, printer: str, offset: int = 0, **kwargs):
    for (i, image) in enumerate(images):
        success = False
        while not success:
            try:
                print(f'- Trying to print image {i} out of {len(images)}')
                status = ql_print(image, label, backend, model, printer, **kwargs)
            except Exception as e:
                print('\tException', e)
                status = {'ready_for_next_job': False, 'printer_is_connected': False}

            if status['ready_for_next_job']:
                print(f'\tSuccessfully printed image {i} out of {len(images)}')
                success = True
            else:
                print(f'\tPrinting error (status is "{status}"), retrying in a little while...')
                time.sleep(5)


def ql_resolution(label: str):
    label_specs = label_type_specs[label]
    resolution = label_specs['dots_printable']

    return resolution


def main(config):
    resolution = ql_resolution(config.label)
    images = load_images(config.input_dir, resolution)

    batches = {
        'red': dict(),
        'orange': dict(),
        'yellow': dict(),
        'green': dict(),
        'blue': dict(),
        'purple': dict()
    }
    how_many_colors = len(batches)

    printed = 0
    for (index, color, image) in images:
        if index + 1 > int(config.skip):
            if printed <= int(config.limit) - 1:
                batch = index // int(config.batch_size) // how_many_colors
                if batch not in batches[color]:
                    batches[color][batch] = []
                batches[color][batch].append([index, image])
                printed += 1
            else:
                print(
                    f'Skipping badge #{index} because more than {printed} stickers have been printed (check the --limit argument)')
        else:
            print(f'Skipping badge #{index} because its index is LOWER than the --skip argument')

    for color in batches:
        for batch_index in batches[color]:
            batch = batches[color][batch_index]
            batch_name = f'{color}_{batch_index}'
            indexes_in_batch = [index for [index, _] in batch]
            badges_in_batch = [badge for [_, badge] in batch]
            will = input(f'Do you want to print batch {batch_name}? (y/N) ({indexes_in_batch}) ').strip()
            if will == 'y':
                ql_bulk_print([image_with_text(batch_name)], config.label, config.backend, config.model, config.printer,
                              cut=False)
                if len(batch) > 1:
                    ql_bulk_print(badges_in_batch[:-1], config.label, config.backend, config.model, config.printer,
                                  cut=False)
                ql_bulk_print(badges_in_batch[-1:], config.label, config.backend, config.model, config.printer,
                              cut=True)
            else:
                print(f'Skipping batch {color}_{batch_index}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Print QR codes for WittyBufficorns at ETHDenver 2022')
    parser.add_argument('--input_dir', help='path for QR image input', default='./qr_codes/')
    parser.add_argument('--batch_size', help='how many stickers to print in each batch', default='5')
    parser.add_argument('--skip', help='how many stickers to skip (will resume from the specified index, inclusive)',
                        default='0')
    parser.add_argument('--limit', help='how many stickers to print at the most', default='500')
    parser.add_argument('--label', choices=label_sizes, help='type of DK label used for printing', default='23x23')
    parser.add_argument('--backend', choices=available_backends, help='Forces the use of a specific backend',
                        default='pyusb')
    parser.add_argument('--model', choices=models, help='Specify the printer model', default='QL-800')
    parser.add_argument('--printer', help='Specify the identifier or address of the printer (this may help: '
                                          '`brother_ql -b pyusb discover`)')
    args = parser.parse_args()
    main(args)
