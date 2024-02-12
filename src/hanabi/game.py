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

from logging import getLogger
from typing import Any
import copy

import numpy as np

from hanabi_learning_environment.pyhanabi import HanabiEndOfGameType
from hanabi_learning_environment.pyhanabi import HanabiGame
from hanabi_learning_environment.pyhanabi import HanabiState
from hanabi_learning_environment import pyhanabi
from hanabi_learning_environment.rl_env import Agent
from hanabi_learning_environment.rl_env import HanabiEnv

from hanabi.config.game import HanabiGameConfig
from hanabi.moves import Move
from hanabi.moves import is_discard_or_play
from hanabi.observations import AgentObservation
from hanabi.observations import Event
from hanabi.observations import FullObservation
from hanabi.observations import PlayerSpecificObservation
from hanabi.observations import from_hanabi_observation
from hanabi.recording import HanabiRecorder


log = getLogger(__name__)


# TODO(ms): rename this to something sensible
class SSEHanabiGame:
    def __init__(self, config: HanabiGameConfig, player_list: list[type[Agent]]) -> None:
        self._config = config

        self._player_list = [p.__name__ for p in player_list]
        self.recorder = HanabiRecorder()
        self._env = HanabiEnv(self._config)
        initial_observation: FullObservation = self._env.reset()

        self.recorder.add_record(
            player=HanabiRecorder.NO_PLAYER_MOVED,
            player_type=HanabiRecorder.NO_PLAYER_MOVED_TYPE,
            move=None,
            observation_after=initial_observation,
            reward=None,
        )

        self._current_observation: FullObservation = initial_observation

    @property
    def max_score(self) -> int:
        return self._config["ranks"] * self._config["colors"]

    @property
    def _game(self) -> HanabiGame:
        return self._env.game

    @property
    def _state(self) -> HanabiState:
        return self._env.state

    @property
    def _event_log(self) -> list[Event]:
        return [
            Event(move=e.move, player_index=e.player)
            for e in self.recorder.records
            if e.move is not None
        ]

    @property
    def current_player(self) -> int:
        return self._state.cur_player()  # type: ignore[no-any-return]

    @property
    def current_full_observation(self) -> FullObservation:
        return self._current_observation

    def make_move(self, move: Move) -> None:
        player = self.current_player

        if (special_move := is_discard_or_play(move)) is not None:
            other_player_index = (self.current_player + 1) % len(self._player_list)

            other_player_observation = self.get_observation(other_player_index)
            offset = other_player_observation["current_player_offset"]
            target_card = other_player_observation["observed_hands"][offset][
                special_move["card_index"]
            ]
            special_move["played_card"] = target_card

        # observation: FullObservation
        # reward: float, Reward obtained from taking the action.
        # done: bool, Whether the game is done.
        # info: dict, Optional debugging information.
        result: tuple[FullObservation, float, bool, dict[str, Any]] = self._env.step(move)
        observation, reward, _done, _info = result

        self.recorder.add_record(
            player=player,
            player_type=self._player_list[self.current_player],
            move=move,
            observation_after=observation,
            reward=reward,
        )
        self._current_observation = observation

    def get_observation(self, player: int) -> PlayerSpecificObservation:
        return from_hanabi_observation(
            self.current_player,
            self._state.fireworks(),
            self._state.observation(player),
            self._env,
            self._event_log,
        )

    def get_agent_observation(self, player: int) -> AgentObservation:
        player_specific = from_hanabi_observation(
            self.current_player,
            self._state.fireworks(),
            (observation := self._state.observation(player)),
            self._env,
            self._event_log,
        )
        return {**player_specific, "pyhanabi": observation}  # type: ignore[misc]

    def is_terminal(self) -> bool:
        return self._state.is_terminal()  # type: ignore[no-any-return]

    def score(self) -> float:
        if not self.is_terminal():
            return -1

        return self._state.score()  # type: ignore[no-any-return]

    def game_end_status(self) -> HanabiEndOfGameType:
        return self._state.end_of_game_status()
