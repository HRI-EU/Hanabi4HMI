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
from pathlib import Path
from threading import Lock
from typing import Any

from flask import Flask
from flask_socketio import SocketIO
from flask_socketio import emit

from hanabi.agents.human_agent import HumanPlayer
from hanabi.agents.timing import configure_default_distribution
from hanabi.agents.timing import get_delay
from hanabi.card import Color
from hanabi.card import Rank
from hanabi.config.game import HanabiGameConfig
from hanabi.config.research import HanabiResearchConfig
from hanabi.config.server import HanabiServerConfig
from hanabi.game import SSEHanabiGame
from hanabi.moves import Move
from hanabi.observations import Hand


log = getLogger(__name__)


def _get_static_folder() -> Path:
    return Path(__file__).parent / "html/static"


class HanabiServer:
    def __init__(
        self,
        config: HanabiServerConfig,
        game_config: HanabiGameConfig,
        research_config: HanabiResearchConfig,
        *,
        start_immediately: bool = True,
    ) -> None:
        self._config = config
        self._research_config = research_config

        self._app = Flask(
            "HanabiServer",
            static_folder=str(_get_static_folder()),
            static_url_path="",
        )
        self._socketio = SocketIO(self._app, cors_allowed_origins="*")

        configure_default_distribution(research_config)

        self._game = SSEHanabiGame(game_config, research_config.player_list)
        self._players = [agent(game_config) for agent in research_config.player_list]
        self._last_moves: dict[int, list[Move]] = {idx: [] for idx in range(len(self._players))}
        self._agent_lock = Lock()

        log.info("Playing a game with: %s", [a.__class__.__name__ for a in self._players])

        self._add_endpoints()

        if start_immediately:
            self._start()

    def _start(self) -> None:
        self._socketio.run(
            app=self._app,
            host=self._config.host,
            port=self._config.port,
        )

    def _add_endpoints(self) -> None:
        self._app.add_url_rule("/shutdown", "shutdown", self._shutdown)
        self._app.add_url_rule("/<int:_>", "index", self._index)
        self._app.add_url_rule("/", "player_choose_page", self._player_choose_page)

        # TODO(ms): double "connect" / "init" necessary/sensible?
        self._socketio.on_event("connect", self._on_init)  # no clue if data is possible here
        self._socketio.on_event("init", self._on_init)
        self._socketio.on_event("move", self._on_move)
        self._socketio.on_event("shutdown", self._shutdown)

    def _player_choose_page(self) -> Any:  # noqa: ANN401
        return self._app.send_static_file("player_choose_page.html")

    def _index(self, _: int) -> Any:  # noqa: ANN401
        return self._app.send_static_file("index.html")

    def _shutdown(self) -> Any:  # noqa: ANN401
        log.info("Received shutdown request...")
        self._socketio.stop()
        self._record()

        return "Server shutting down..."

    def _record(self) -> None:
        log.info("Writing record log")
        self._game.recorder.write_log(self._research_config.record_file)

    def _on_init(self, data: Any) -> None:  # noqa: ANN401
        log.info("Got an init request, data: %s", data)
        self._emit_game_state()

        self._handle_next_agent()

    def _is_revealed(self, player: int, fact: Rank | Color | None) -> bool:
        if isinstance(fact, int):
            return any(
                last_move["rank"] == fact
                for last_move in self._last_moves[player]
                if last_move["action_type"] == "REVEAL_RANK"
            )

        return any(
            last_move["color"] == fact
            for last_move in self._last_moves[player]
            if last_move["action_type"] == "REVEAL_COLOR"
        )

    def _correct_knowledge(self, player: int, card_knowledge: list[Hand]) -> list[Hand]:
        # we only want to manipulate the knowledge for idx=0 as this is players own hand
        own_hand: Hand = [
            {
                "rank": card["rank"] if self._is_revealed(player, card["rank"]) else -1,
                "color": card["color"] if self._is_revealed(player, card["color"]) else None,
            }
            for card in card_knowledge[0]
        ]

        return [own_hand, *card_knowledge[1:]]

    def _emit_game_state(self) -> None:
        log.debug("Trying to emit game state")
        for player in range(len(self._players)):
            log.debug(
                "Player %s specific observations: %s",
                player,
                observation := self._game.get_observation(player),
            )

            if not self._research_config.always_show_full_knowledge:
                observation["card_knowledge"] = self._correct_knowledge(
                    player, observation["card_knowledge"]
                )

            if self._research_config.disable_discard_pile:
                observation["discard_pile"] = None
            elif (
                self._research_config.only_show_last_n_discards > -1
                and observation["discard_pile"] is not None
            ):
                observation["discard_pile"] = observation["discard_pile"][
                    -self._research_config.only_show_last_n_discards :
                ]

            if self._research_config.only_show_last_n_events > -1:
                observation["event_log"] = observation["event_log"][
                    -self._research_config.only_show_last_n_events :
                ]

            emit(
                "game_state",
                {"player_id": player, "observation": observation},
                broadcast=True,
            )

            log.debug("Emitted successfully for player: %s", player)

        if self._game.is_terminal():
            reason = self._game.game_end_status()
            score = self._game.score()
            log.debug("Sending GAME_ENDED event with reason: %s | score: %s", reason, score)
            emit(
                "game_ended",
                {
                    "reason": reason,
                    "score": score,
                    "max_score": self._game.max_score,
                },
                broadcast=True,
            )

    def _update_move_lists(self, player: int, move: Move) -> None:
        for idx in range(len(self._players)):
            if idx == player:
                # clear player who made a move
                self._last_moves[idx] = []
                continue

            # TODO(ms): move could reveal something not on my side
            self._last_moves[idx].append(move)

    def _on_move(
        self, move: Move, *, agent: bool = False
    ) -> None:
        log.info("Got move, data: %s, by agent? %s", move, agent)

        player_that_moved = self._game.current_player
        try:
            self._game.make_move(move)
        except AssertionError:
            log.exception("Ignoring illegal move %s from agent %s, could break game!", move, agent)

        if not self._research_config.always_show_full_knowledge:
            log.debug("Update last moves knowledge")
            self._update_move_lists(player_that_moved, move)
            log.debug("Update finished")

        log.debug("Moved successfully")
        self._emit_game_state()
        log.debug("Emmitted new game state")

        if self._game.is_terminal():
            log.info("Game has ended with reason: %s", self._game.game_end_status())
            self._record()
            return

        if not agent:
            self._handle_next_agent()
            log.debug("Handled all non-human agents")

    @staticmethod
    def _sanitize_move(move: Move) -> Move:
        if move["action_type"] == "PLAY" or move["action_type"] == "DISCARD":
            return {  # type: ignore[return-value]
                "action_type": move["action_type"],
                "card_index": int(move["card_index"]),
            }

        if move["action_type"] == "REVEAL_COLOR":
            return {
                "action_type": move["action_type"],
                "color": str(move["color"]),
                "target_offset": int(move["target_offset"]),
            }

        if move["action_type"] == "REVEAL_RANK":
            return {
                "action_type": move["action_type"],
                "rank": int(move["rank"]),
                "target_offset": int(move["target_offset"]),
            }

        # this is completely unreachable according to mypy but other linters
        # have problems understanding types
        msg = f"move={move!r} has no recognized type"  # type: ignore[unreachable]
        raise ValueError(msg)

    def _handle_next_agent(self) -> None:
        if self._agent_lock.locked():
            return

        with self._agent_lock:
            while (
                not isinstance((agent := self._players[self._game.current_player]), HumanPlayer)
                and not self._game.is_terminal()
            ):
                log.debug("Next agent: %s", agent)
                move = self._sanitize_move(
                    agent.act(self._game.get_agent_observation(self._game.current_player)),
                )
                delay = get_delay(agent)
                log.info(
                    "Agent %s chose move %s, executing with delay: %5.2f",
                    agent.__class__.__name__,
                    move,
                    delay,
                )
                self._socketio.sleep(delay)
                self._on_move(move, agent=True)
