#!/usr/bin/env python3

import argparse
import hashlib
import os
import qrcode

from typing import List
from qrcode.image.pure import PymagingImage

colors = ['green', 'black', 'red', 'purple', 'negative', 'yellow', 'blue']

class Egg:
    def __init__(self, index, key):
        self.index = index
        self.key = key


def generate_egg(index: int, salt: str, key_len: int):
    seed = hashlib.sha256()
    seed.update(bytes(f'{salt}|{index}', encoding='utf8'))
    key = seed.digest()[:key_len].hex()

    return Egg(index, key)


def generate_eggs(eggs_count: int, salt: str, key_len: int):
    return [generate_egg(index, salt, key_len) for index in range(eggs_count)]


def colorize(index: int) -> str:
    return colors[index % len(colors)]


def generate_qr_code(egg: Egg, base_url: str, output_dir: str):
    url = f'{base_url}{egg.key}'
    output_path = f'{output_dir}/{egg.index}-{egg.key}-{colorize(egg.index)}.png'

    img = qrcode.make(url, image_factory=PymagingImage, error_correction=qrcode.ERROR_CORRECT_M, border=0)

    with open(output_path, 'wb') as file:
        img.save(file, 'PNG')


def generate_qr_codes(eggs: List[Egg], base_url: str, output_dir: str):
    output_dir_fd = os.path.dirname(output_dir)
    if not os.path.exists(output_dir_fd):
        os.makedirs(output_dir_fd)

    return [generate_qr_code(egg, base_url, output_dir) for egg in eggs]


def main(config):
    eggs = generate_eggs(int(config.eggs), config.salt, int(config.key_len))
    [print(f'{egg.index} → {egg.key} ({colorize(egg.index)})') for egg in eggs]
    generate_qr_codes(eggs, config.base_url, config.output_dir)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate QR codes for WittyCreatures at Liscon 2021')
    parser.add_argument('--eggs', help='how many eggs to generate', default=10)
    parser.add_argument('--salt', help='a string to use as salt for deterministic egg key derivation', default='')
    parser.add_argument('--key_len', help='the byte length of egg keys', default=8)
    parser.add_argument('--base_url', help='base URL for QR codes', default='https://wittycreatures.com/#/egg/')
    parser.add_argument('--output_dir', help='path for QR image output', default='./qr_codes/')
    args = parser.parse_args()
    main(args)
