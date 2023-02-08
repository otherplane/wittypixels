#!/usr/bin/env python3

import argparse
import hashlib
import math
import os
import qrcode

from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from typing import List
from qrcode.image.pure import PymagingImage

colors = {
    'red': '#EA033A',
    'orange': '#FF5730',
    'yellow': '#F5EA0A',
    'green': '#56C553',
    'blue': '#5C96FF',
    'purple': '#8D52FF'
}

logo = Image.open('./logo.png')
font = ImageFont.truetype('./font.ttf', 19)


class Player:
    def __init__(self, index, key):
        self.index = index
        self.key = key


def generate_player(index: int, salt: str, key_len: int, bonus: bool):
    seed = hashlib.sha256()
    salt = f'{salt}|{bonus}' if bonus else salt
    seed.update(bytes(f'{salt}|{index}', encoding='utf8'))
    key = seed.digest()[:key_len].hex()

    return Player(index, key)


def generate_players(players_count: int, salt: str, key_len: int, bonus: bool):
    return [generate_player(index, salt, key_len, bonus) for index in range(players_count)]


def tell_color_name(index: int) -> str:
    return list(colors.keys())[index % len(colors.keys())]


def tell_color_code(index: int) -> str:
    return colors[tell_color_name(index)]


def decode_color_code(encoded: str) -> (int, int, int):
    return int(encoded[1:3], 16), int(encoded[3:5], 16), int(encoded[5:7], 16)


def generate_qr_code(player: Player, base_url: str, output_dir: str, bonus: bool):
    url = f'{base_url}{player.key}'
    color_name = tell_color_name(player.index)
    interpolation = 'bonus-' if bonus else ''
    output_path = f'{output_dir}/{interpolation}{player.index}-{player.key}-{color_name}.png'

    border = 4.5 if bonus else 0
    box_size = 30 if bonus else 10

    img = qrcode.make(url, image_factory=PymagingImage, error_correction=qrcode.ERROR_CORRECT_M, border=border,
                      box_size=box_size)

    with open(output_path, 'wb') as file:
        img.save(file, 'PNG')

    if bonus:
        qr = Image.open(output_path)

        color_code = decode_color_code(tell_color_code(player.index))
        serial = f'{player.key}{color_name[0].upper()}{player.index:03d}'

        white = Image.new('RGB', (qr.width, qr.height), 'white')
        solid = Image.new('RGB', (qr.width, qr.height), 'white')
        ImageDraw.Draw(solid).rectangle([(0, 0), (solid.width, solid.height)], color_code)
        background = Image.blend(white, solid, 0.25)

        mask = qr.convert('L')
        im = Image.composite(background, qr, mask)

        center = (im.width - logo.width) // 2
        true_center = im.width // 2 - 15
        margin = 25

        ImageDraw.Draw(im).rectangle([(true_center, true_center), (true_center + 29, true_center + 29)], color_code)
        ImageDraw.Draw(im).text((130, im.width - 146), serial, 'white', font=font, spacing=-2)

        logo_bottom = logo
        logo_left = logo_bottom.rotate(90, expand=1)
        logo_top = logo_bottom.rotate(180)
        logo_right = logo_bottom.rotate(270, expand=1)

        im.paste(logo_top, (center, margin), logo_top)
        im.paste(logo_right, (margin, center), logo_right)
        im.paste(logo_bottom, (center, im.height - logo_bottom.height - margin), logo_bottom)
        im.paste(logo_left, (im.width - logo_left.width - margin, center), logo_left)

        im.save(output_path)


def generate_qr_codes(players: List[Player], base_url: str, output_dir: str, bonus: bool):
    output_dir_fd = os.path.dirname(output_dir)
    if not os.path.exists(output_dir_fd):
        os.makedirs(output_dir_fd)

    return [generate_qr_code(player, base_url, output_dir, bonus) for player in players]


def main(config):
    players = generate_players(int(config.players), config.salt, int(config.key_len), config.bonus)
    [print(f'{player.index};{player.key};{tell_color_name(player.index)}') for player in players]
    generate_qr_codes(players, config.base_url, config.output_dir, config.bonus)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate QR codes for WittyCreatures at Liscon 2021')
    parser.add_argument('--players', help='how many players to generate', default=10)
    parser.add_argument('--salt', help='a string to use as salt for deterministic player key derivation', default='')
    parser.add_argument('--key_len', help='the byte length of player keys', default=8)
    parser.add_argument('--base_url', help='base URL for QR codes', default='https://wittypixels.art/#/')
    parser.add_argument('--bonus', help="Generate bonuses instead of players", default=False)
    parser.add_argument('--output_dir', help='path for QR image output', default='./qr_codes/')
    args = parser.parse_args()
    main(args)
