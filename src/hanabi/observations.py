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
from __future__ import annotations

from typing import List
from typing import TypedDict

from hanabi_learning_environment.pyhanabi import COLOR_CHAR
from hanabi_learning_environment.pyhanabi import HanabiCardKnowledge
from hanabi_learning_environment.pyhanabi import HanabiObservation
from hanabi_learning_environment.rl_env import HanabiEnv
from hanabi_learning_environment.pyhanabi import color_idx_to_char

from hanabi.card import Card
from hanabi.moves import Move


class Fireworks(TypedDict):
    """
    Played cards on the different firework piles.

    Meanings:
        0 -> No cards played onto pile
        1 -> First card is played onto pile
        ...
        5 -> Pile is fully played
    """

    B: int
    G: int
    R: int
    W: int
    Y: int


Hand = List[Card]


class Event(TypedDict):
    """Single move executed by a player."""

    move: Move
    player_index: int


class PlayerSpecificObservation(TypedDict):
    current_player: int
    current_player_offset: int
    deck_size: int
    discard_pile: list[Card] | None
    fireworks: Fireworks
    information_tokens: int
    legal_moves: list[Move]
    legal_moves_as_int: list[int]
    life_tokens: int
    observed_hands: list[Hand]
    card_knowledge: list[Hand]
    num_players: int
    event_log: list[Event]


def _transform_card_knowledge(hand_hints: list[HanabiCardKnowledge]) -> Hand:
    hand: Hand = []
    for hint in hand_hints:
        color = hint.color()
        hand.append(
            {
                "color": None if color is None else color_idx_to_char(color),
                "rank": hint.rank(),
            },
        )

    return hand


def from_hanabi_observation(
    current_player: int,
    fireworks: list[int],
    observation: HanabiObservation,
    env: HanabiEnv,
    event_log: list[Event],
) -> PlayerSpecificObservation:
    coded_fireworks: Fireworks = dict(zip(COLOR_CHAR, fireworks))  # type: ignore[assignment]

    return {
        "current_player": current_player,
        "current_player_offset": observation.cur_player_offset(),
        "deck_size": observation.deck_size(),
        "discard_pile": [card.to_dict() for card in observation.discard_pile()],
        "fireworks": coded_fireworks,
        "information_tokens": observation.information_tokens(),
        "legal_moves": [move.to_dict() for move in observation.legal_moves()],
        "legal_moves_as_int": [env.game.get_move_uid(move) for move in observation.legal_moves()],
        "life_tokens": observation.life_tokens(),
        "observed_hands": [
            [card.to_dict() for card in hand] for hand in observation.observed_hands()
        ],
        "card_knowledge": [
            _transform_card_knowledge(hand) for hand in observation.card_knowledge()
        ],
        "num_players": observation.num_players(),
        "event_log": event_log,
        "vectorized": env.observation_encoder.encode(observation),
    }


def lighten_observation(full: FullObservation) -> FlyweightObservation:
    observation = full.copy()
    observation["player_observations"] = [player.copy() for player in full["player_observations"]]

    for player in observation["player_observations"]:
        if "pyhanabi" in player:
            del player["pyhanabi"]  # type: ignore[misc]
        if "vectorized" in player:
            del player["vectorized"]  # type: ignore[misc]

    return observation  # type: ignore[return-value]


class FullObservation(TypedDict):
    current_player: int
    player_observations: list[AgentObservation]


class FlyweightObservation(TypedDict):
    current_player: int
    player_observations: list[PlayerSpecificObservation]


class AgentObservation(PlayerSpecificObservation):
    pyhanabi: HanabiObservation
    vectorized: list[int]
