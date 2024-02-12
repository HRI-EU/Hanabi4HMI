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

from typing import Literal
from typing import TypedDict
from typing import Union

from hanabi.card import Card


ActionType = Literal["PLAY", "DISCARD", "REVEAL_COLOR", "REVEAL_RANK"]


class PlayMove(TypedDict):
    action_type: Literal["PLAY"]
    card_index: int
    played_card: Card | None


class DiscardMove(TypedDict):
    action_type: Literal["DISCARD"]
    card_index: int
    played_card: Card | None


class RevealColor(TypedDict):
    action_type: Literal["REVEAL_COLOR"]
    color: str
    target_offset: int


class RevealRank(TypedDict):
    action_type: Literal["REVEAL_RANK"]
    rank: int
    target_offset: int


Move = Union[PlayMove, DiscardMove, RevealRank, RevealColor]


def is_discard_or_play(move: Move) -> PlayMove | DiscardMove | None:
    if move["action_type"] in ("PLAY", "DISCARD"):
        return move  # type: ignore[return-value]

    return None
