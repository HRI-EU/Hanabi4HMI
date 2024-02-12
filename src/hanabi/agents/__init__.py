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

from pkg_resources import resource_filename

from hanabi_learning_environment.agents.random_agent import RandomAgent
from hanabi_learning_environment.agents.simple_agent import SimpleAgent
from hanabi_learning_environment.rl_env import Agent

from hanabi.agents.external.flawed_agent import FlawedAgent
from hanabi.agents.external.iggi_agent import IGGIAgent
from hanabi.agents.external.internal_agent import InternalAgent
from hanabi.agents.external.internal_discard_oldest import InternalDiscardOldest
from hanabi.agents.external.internal_probabilistic import InternalProbabilistic
from hanabi.agents.external.internal_swapped import InternalSwapped
from hanabi.agents.external.legal_random_agent import LegalRandomAgent
from hanabi.agents.external.outer_agent import OuterAgent
from hanabi.agents.external.piers_agent import PiersAgent
from hanabi.agents.external.van_den_bergh_agent import VanDenBerghAgent
from hanabi.agents.external.rainbow_agent import TrainedRainbowAgent
from hanabi.agents.human_agent import HumanPlayer


AGENT_MAP = {
    "human": HumanPlayer,
    "flawed": FlawedAgent,
    "iggi": IGGIAgent,
    "internal": InternalAgent,
    "discard_oldest": InternalDiscardOldest,
    "probabilistic": InternalProbabilistic,
    "swapped": InternalSwapped,
    "legal_random": LegalRandomAgent,
    "outer": OuterAgent,
    "piers": PiersAgent,
    "random": RandomAgent,
    "simple": SimpleAgent,
    "bergh": VanDenBerghAgent,
    "rainbow": TrainedRainbowAgent,
}

RAINBOW_TYPES = [
    "aiide_all1",
    "aiide_all2",
    "aiide_flawed1",
    "aiide_flawed2",
    "aiide_iggi1",
    "aiide_iggi2",
    "aiide_internal1",
    "aiide_internal2",
    "aiide_mirror1",
    "aiide_mirror2",
    "aiide_outer1",
    "aiide_outer2",
    "aiide_piers1",
    "aiide_piers2",
    "aiide_rb1",
    "aiide_rb2",
    "aiide_vdb1",
    "aiide_vdb2",
    "paired_ensemble",
    "paired_flawed",
    "paired_iggi",
    "paired_internal",
    "paired_outer",
    "paired_piers",
    "paired_random",
    "selfplay1",
    "selfplay2",
    "selfplay3",
    "selfplay4",
    "selfplay5",
]

class AgentNotFoundError(Exception):
    def __init__(self) -> None:
        super().__init__("Specified Agent was not found!")


def get_players(player_list: list[str]) -> list[type[Agent]]:
    try:
        return [AGENT_MAP[player] for player in player_list]
    except KeyError as e:
        raise AgentNotFoundError from e
