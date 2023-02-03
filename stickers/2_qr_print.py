#!/usr/bin/env python3

import argparse
from brother_ql.backends import available_backends
from brother_ql.backends.helpers import send
from brother_ql.conversion import convert
from brother_ql.devicedependent import label_sizes, label_type_specs, models
from brother_ql.raster import BrotherQLRaster
import glob
from PIL import Image, ImageFont
from PIL import ImageDraw
from typing import List, Tuple


def tell_color(path: str):
    return path.split('-')[-1].split('.')[0]


def load_image(path: str, resolution: Tuple[int, int]):
    with Image.open(path) as image:
        extended = Image.new('1', (round(resolution[0] * 1.55), round(resolution[1] * 1.55)), 1)
        extended.paste(image, (round(resolution[0] * 0.2), 0))

        return extended.resize(resolution)


def load_images(input_dir: str, resolution: Tuple[int, int]):
    files = glob.glob(f'{input_dir}/*-*-*.png')

    return [[tell_color(file), load_image(file, resolution)] for file in files]


def image_with_text(text: str):
    image = Image.new('RGBA', (250, 225), 'white')
    ImageDraw.Draw(image).text((20, 10), text, (0, 0, 0), align='center')

    return image


def ql_bulk_print(images: List[str], label: str, backend: str, model: str, printer: str, **kwargs):
    qlr = BrotherQLRaster(model)
    qlr.exception_on_warning = True
    instructions = convert(qlr, images, label, hq=True, **kwargs)
    send(instructions, printer_identifier=printer, backend_identifier=backend, blocking=True)


def ql_resolution(label: str):
    label_specs = label_type_specs[label]
    resolution = label_specs['dots_printable']

    return resolution


def main(config):
    resolution = ql_resolution(config.label)
    images = load_images(config.input_dir, resolution)

    colored_images = {
        'red': [],
        'orange': [],
        'yellow': [],
        'green': [],
        'blue': [],
        'purple': []
    }

    for [color, image] in images:
        colored_images[color].append(image)

    for color in colored_images:
        ql_bulk_print([image_with_text(color)], config.label, config.backend, config.model, config.printer, cut=False)
        ql_bulk_print(colored_images[color][:-1], config.label, config.backend, config.model, config.printer, cut=False)
        ql_bulk_print(colored_images[color][-1:], config.label, config.backend, config.model, config.printer, cut=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate QR codes for WittyPixels')
    parser.add_argument('--input_dir', help='path for QR image input', default='./qr_codes/')
    parser.add_argument('--label', choices=label_sizes, help='type of DK label used for printing', default='23x23')
    parser.add_argument('--backend', choices=available_backends, help='Forces the use of a specific backend',
                        default='pyusb')
    parser.add_argument('--model', choices=models, help='Specify the printer model', default='QL-800')
    parser.add_argument('--printer', help='Specify the identifier or address of the printer')
    args = parser.parse_args()
    main(args)
