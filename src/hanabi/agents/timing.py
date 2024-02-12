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

from typing import Callable

from hanabi_learning_environment.rl_env import Agent
from numpy import random

from hanabi.agents.human_agent import HumanPlayer
from hanabi.config.research import HanabiResearchConfig


DelayTimeFunction = Callable[[], float]

rng = random.default_rng()


def _normal_timing_distribution(
    mean: float,
    standard_deviation: float,
    minimum_response_time: float,
) -> DelayTimeFunction:
    def inner() -> float:
        return max(
            rng.normal(loc=mean, scale=standard_deviation),
            minimum_response_time,
        )

    return inner


def _no_delay() -> float:
    return 0


TIMING_MAP: dict[type[Agent], DelayTimeFunction] = {
    HumanPlayer: _no_delay,
}


def _default_timing_distribution() -> float:
    return 1


def configure_default_distribution(config: HanabiResearchConfig) -> None:
    global _default_timing_distribution  # noqa: PLW0603

    _default_timing_distribution = _normal_timing_distribution(
        config.mean,
        config.standard_deviation,
        config.minimum_response_time,
    )


def get_delay(agent: type[Agent] | Agent) -> float:
    t = agent if isinstance(agent, type) else type(agent)

    return TIMING_MAP.get(t, _default_timing_distribution)()
