#!/usr/bin/env python3

import argparse
import hashlib
import os
import qrcode

from typing import List
from qrcode.image.pure import PymagingImage

colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

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


def colorize(index: int) -> str:
    return colors[index % len(colors)]


def generate_qr_code(player: Player, base_url: str, output_dir: str, bonus: bool):
    url = f'{base_url}{player.key}'
    output_path = f'{output_dir}/{player.index}-{player.key}-{colorize(player.index)}.png'

    border = 4 if bonus else 0
    box_size = 30 if bonus else 1

    img = qrcode.make(url, image_factory=PymagingImage, error_correction=qrcode.ERROR_CORRECT_M, border=border, box_size=box_size)

    with open(output_path, 'wb') as file:
        img.save(file, 'PNG')


def generate_qr_codes(players: List[Player], base_url: str, output_dir: str, bonus: bool):
    output_dir_fd = os.path.dirname(output_dir)
    if not os.path.exists(output_dir_fd):
        os.makedirs(output_dir_fd)

    return [generate_qr_code(player, base_url, output_dir, bonus) for player in players]


def main(config):
    players = generate_players(int(config.players), config.salt, int(config.key_len), config.bonus)
    [print(f'{player.index} → {player.key} ({colorize(player.index)})') for player in players]
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
