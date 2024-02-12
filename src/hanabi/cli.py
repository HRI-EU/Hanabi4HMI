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

import logging

from argparse import ArgumentDefaultsHelpFormatter
from argparse import ArgumentParser
from argparse import Namespace
from functools import partial
from pathlib import Path
from typing import NamedTuple

from hanabi.agents import AGENT_MAP, RAINBOW_TYPES
from hanabi.agents import get_players
from hanabi.config.game import HanabiGameConfig
from hanabi.config.research import HanabiResearchConfig
from hanabi.config.server import HanabiServerConfig
from hanabi.server import HanabiServer


class RecordFileAlreadyExistsError(Exception):
    def __init__(self, path: Path) -> None:
        self.path = path
        super().__init__(f"Record file at {path!s} already exists!")


class Arguments(NamedTuple):
    game_options: HanabiGameConfig
    server_options: HanabiServerConfig
    research_options: HanabiResearchConfig

    @classmethod
    def from_parser(cls, args: Namespace) -> Arguments:
        return cls(
            game_options={
                "players": len(args.player_list),
                "colors": args.colors,
                "ranks": args.ranks,
                "hand_size": args.hand_size,
                "max_information_tokens": args.max_information_tokens,
                "max_life_tokens": args.max_life_tokens,
                "seed": args.seed,
                "random_start_player": not args.no_random_start_player,
                "rainbow_type": args.rainbow_type,
            },
            server_options=HanabiServerConfig(
                args.host,
                args.port,
            ),
            research_options=HanabiResearchConfig(
                record_file=Path(args.record_file),
                player_list=get_players(args.player_list),
                mean=args.mean,
                standard_deviation=args.standard_deviation,
                minimum_response_time=args.minimum_response_time,
                always_show_full_knowledge=not args.show_diff_knowledge,
                only_show_last_n_discards=args.only_show_last_n_discards,
                only_show_last_n_events=args.only_show_last_n_events,
                disable_discard_pile=args.disable_discard_pile,
            ),
        )


def _parse() -> Arguments:
    parser = ArgumentParser(
        description="Test system for Hanabi study.",
        formatter_class=ArgumentDefaultsHelpFormatter,
    )

    research_options_parser = parser.add_argument_group("RESEARCH OPTIONS")
    research_options_parser.add_argument(
        "--record-file",
        type=str,
        default="records.csv",
        help="Where the recording in csv-format should be exported to",
    )
    research_options_parser.add_argument(
        "--player-list",
        type=partial(str.split, sep=","),
        default=["human", "random"],
        help=f"Comma separated list of agents, possible agents: {', '.join(AGENT_MAP.keys())}",
    )
    research_options_parser.add_argument(
        "--rainbow-type",
        type=str,
        default="paired_piers",
        help=f"Type of trained Rainbow agent to use if Rainbow agent is in player list: {', '.join(RAINBOW_TYPES)} ",
    )
    research_options_parser.add_argument(
        "--mean",
        type=float,
        default=2.0,
        help="Mean of the timing distribution for non-human agents",
    )
    research_options_parser.add_argument(
        "--standard-deviation",
        type=float,
        default=1,
        help="standard-deviation for the timing distribution for non-human agents",
    )
    research_options_parser.add_argument(
        "--minimum-response-time",
        type=float,
        default=1,
        help="Minimum response time for non-human agents",
    )
    research_options_parser.add_argument(
        "--only-show-diff-knowledge",
        action="store_true",
        dest="show_diff_knowledge",
        help="Only show what you learned from the last hint",
    )
    research_options_parser.add_argument(
        "--only-show-last-n-discards",
        metavar="N",
        type=int,
        default=-1,
        help="Only show the last N discards or -1 for everything",
    )
    research_options_parser.add_argument(
        "--only-show-last-n-events",
        metavar="N",
        type=int,
        default=-1,
        help="Only show the last N events or -1 for everything",
    )
    research_options_parser.add_argument(
        "--disable-discard-pile",
        action="store_true",
        help="Disable discard pile entirely, trumps --only-show-last-n-discards",
    )

    game_options_parser = parser.add_argument_group("GAME OPTIONS")
    game_options_parser.add_argument(
        "--colors",
        type=int,
        default=5,
        help="Color count, maximum 5",
    )
    game_options_parser.add_argument(
        "--ranks",
        type=int,
        default=5,
        help="Card ranks, maximum 5",
    )
    game_options_parser.add_argument(
        "--hand-size",
        type=int,
        default=5,
        help="Hand size",
    )
    game_options_parser.add_argument(
        "--max-information-tokens",
        type=int,
        default=8,
        help="Max information tokens",
    )
    game_options_parser.add_argument(
        "--max-life-tokens",
        type=int,
        default=3,
        help="Max life tokens",
    )
    game_options_parser.add_argument(
        "--seed",
        type=int,
        default=-1,
        help="Random seed for card/game generation",
    )
    game_options_parser.add_argument(
        "--no-random-start-player",
        action="store_true",
        help="start player chosen at random",
    )

    server_options_parser = parser.add_argument_group("SERVER OPTIONS")
    server_options_parser.add_argument(
        "--host",
        type=str,
        default="0.0.0.0",  # noqa: S104
        help="Where the game server should be available",
    )
    server_options_parser.add_argument(
        "--port",
        type=int,
        default="8000",
        help="Where the game server should be available",
    )

    args = parser.parse_args()

    return Arguments.from_parser(args)


def main() -> None:
    log_format = "%(asctime)s - %(levelname)-4s  [%(filename)s:%(funcName)10s():l %(lineno)d] %(message)s"
    logging.basicConfig(level=logging.INFO, format=log_format)
    log = logging.getLogger(__name__)

    arguments = _parse()

    if arguments.research_options.record_file.exists():
        raise RecordFileAlreadyExistsError(arguments.research_options.record_file)

    log.debug("Starting server...")
    HanabiServer(
        arguments.server_options,
        game_config=arguments.game_options,
        research_config=arguments.research_options,
    )
