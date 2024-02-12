# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Random Agent."""
from __future__ import annotations

import random

from hanabi_learning_environment.rl_env import Agent


class RandomAgent(Agent):
    """Agent that takes random legal actions."""

    def __init__(self, config, *args, **kwargs) -> None:
        """Initialize the agent."""
        self.config = config

    def act(self, observation):
        """Act based on an observation."""
        if observation["current_player_offset"] == 0:
            return random.choice(observation["legal_moves"])
        else:
            return None
