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

from hanabi_learning_environment.pyhanabi import HanabiMove
from hanabi_learning_environment.pyhanabi import HanabiObservation
from hanabi_learning_environment.rl_env import Agent

from hanabi.config.game import HanabiGameConfig


class HumanPlayerCannotActError(Exception):
    def __init__(self) -> None:
        super().__init__("This agent represents a human so it cannot act itself.")


class HumanPlayer(Agent):  # type: ignore[misc]
    def __init__(  # type: ignore[no-untyped-def]
        self,
        config: HanabiGameConfig,
        *args,  # noqa: ANN002
        **kwargs,  # noqa: ANN003
    ) -> None:
        pass

    def reset(self, config: HanabiGameConfig) -> None:  # noqa: ARG002
        raise HumanPlayerCannotActError

    def act(self, observation: HanabiObservation) -> HanabiMove:  # noqa: ARG002
        raise HumanPlayerCannotActError
