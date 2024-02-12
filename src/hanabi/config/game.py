#
#  Copyright (c) Honda Research Institute Europe GmbH
#
#  Redistribution and use in source and binary forms, with or without
#  modification, are permitted provided that the following conditions are
#  met:
#
#  1. Redistributions of source code must retain the above copyright notice,
#     this list of conditions and the following disclaimer.
#
#  2. Redistributions in binary form must reproduce the above copyright
#     notice, this list of conditions and the following disclaimer in the
#     documentation and/or other materials provided with the distribution.
#
#  3. Neither the name of the copyright holder nor the names of its
#     contributors may be used to endorse or promote products derived from
#     this software without specific prior written permission.
#
#  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
#  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
#  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
#  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
#  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
#  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
#  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
#  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
#  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
#  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
#  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#
#
# "players": 2 <= number of players <= 5
# "colors": 1 <= number of different card colors in deck <= 5
# "rank": 1 <= number of different card ranks in deck <= 5
# "hand_size": 1 <= number of cards in player hand
# "max_information_tokens": 1 <= maximum (and initial) number of info tokens.
# "max_life_tokens": 1 <= maximum (and initial) number of life tokens.
# "seed": random number seed. -1 to use system random device to get seed.
# "random_start_player": boolean. If true, start with random player, not 0.
# "observation_type": int AgentObservationType.
from __future__ import annotations

from typing import TypedDict


class HanabiGameConfig(TypedDict):
    players: int
    colors: int
    ranks: int
    hand_size: int
    max_information_tokens: int
    max_life_tokens: int
    seed: int
    random_start_player: bool
    rainbow_type: str


def default_game_config(players: int = 2) -> HanabiGameConfig:
    return {
        "players": players,
        "colors": 5,
        "ranks": 5,
        "hand_size": 1,
        "max_information_tokens": 8,
        "max_life_tokens": 3,
        "seed": -1,
        "random_start_player": False,
        "rainbow_type": "paired_piers",  # configuration is only needed for rainbow agents and otherwise ignored
    }
