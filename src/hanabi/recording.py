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

import csv

from dataclasses import dataclass
from datetime import datetime
from datetime import timezone
from itertools import tee
from logging import getLogger
from pathlib import Path
from typing import Final
from typing import Iterable
from typing import Iterator
from typing import TypeVar

from hanabi.moves import Move
from hanabi.observations import FlyweightObservation
from hanabi.observations import FullObservation
from hanabi.observations import lighten_observation


log = getLogger(__name__)

T = TypeVar("T")


def _pairwise(iterable: Iterable[T]) -> Iterator[tuple[T, T]]:
    # this exists in 3.10 but not in 3.8
    a, b = tee(iterable)
    next(b, None)
    return zip(a, b)


@dataclass
class HanabiRecord:
    player: int
    player_type: str
    move: Move | None
    observation_after: FullObservation
    time: datetime
    reward: float | None

    def to_line(self, time_before: datetime) -> tuple[int, str, Move | None, FlyweightObservation, float | None, float, list[list[int]]]:
        return (
            self.player,
            self.player_type,
            self.move,
            lighten_observation(self.observation_after),
            self.reward,
            (self.time - time_before).total_seconds(),
            [player["vectorized"] for player in self.observation_after["player_observations"]],
        )

    @staticmethod
    def get_title_line() -> list[str]:
        return ["player", "player_type", "move", "observation_after", "reward", "time_delta_seconds", "vectorized_game_state"]


class HanabiRecorder:
    NO_PLAYER_MOVED: Final[int] = -1
    NO_PLAYER_MOVED_TYPE: Final[str] = "init"

    def __init__(self) -> None:
        self.records: list[HanabiRecord] = []

    def add_record(  # noqa: PLR0913
        self,
        player: int,
        player_type: str,
        move: Move | None,
        reward: float | None,
        observation_after: FullObservation,
    ) -> None:
        self.records.append(
            HanabiRecord(
                player,
                player_type,
                move,
                observation_after,
                datetime.now(tz=timezone.utc),
                reward,
            ),
        )

    # TODO(ms): make optional / stdout / file / etc
    def write_log(self, logfile: Path = Path("logfile.csv")) -> None:
        log.debug("Writing csv into: %s", str(logfile))

        logfile.parent.mkdir(parents=True, exist_ok=True)

        with logfile.open("w", newline="") as file:
            writer = csv.writer(file)

            writer.writerow(HanabiRecord.get_title_line())

            writer.writerow(self.records[0].to_line(self.records[0].time))
            writer.writerows([r[1].to_line(r[0].time) for r in _pairwise(self.records)])

        log.debug("Sucessfully written csv!")
