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
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import logging
from pathlib import Path
from pkg_resources import resource_filename

import numpy as np

import torch

from hanabi_learning_environment import rl_env


class TrainedRainbowAgent:
    """Loads a pre-trained Rainbow Agent from disk"""

    def __init__(
        self,
        config,
        checkpoints_path: Path = None,
    ) -> None:
        if checkpoints_path is None:
            checkpoints_path = resource_filename(__name__, "rainbow_checkpoints_torch/")
        network_filename = Path(checkpoints_path).joinpath(f"{config['rainbow_type']}.pt")
        logging.info("Loading agent network %s", network_filename)
        self.network = torch.load(network_filename)
        self.environment = rl_env.make(
            environment_name="Hanabi-Full-CardKnowledge", num_players=2, pyhanabi_path=None
        )
        self.num_actions = self.environment.num_moves()  # 20 moved
        self.num_atoms = 51  # TODO understand settings
        self.vmax = 25  # TODO understand settings
        self.support = torch.linspace(start=-self.vmax, end=self.vmax, steps=self.num_atoms)
        logging.debug("Agent loaded")
        logging.debug("N moved in environment: %d", self.num_actions)

    def act(self, observation):
        """Select action based on current environment observation

        Parameters
        ----------
        observation : dict
            Environment observation containing entries "vectorized" and
            "legal_moves_as_int".

        Returns
        -------
        _type_
            _description_
        """
        # TODO the original act function is equivalent to DQNAgent._select_action()?
        illegal_actions = self.get_illegal_actions(
            observation["legal_moves_as_int"], self.num_actions
        )
        logging.debug("Legal moves: %s", observation["legal_moves"])
        flat_distribution_logits = self.network(torch.Tensor(observation["vectorized"]))
        distribution_logits = flat_distribution_logits.reshape(
            [-1, self.num_actions, self.num_atoms]
        )
        distribution_probs = distribution_logits.softmax(dim=2)
        q = distribution_probs.mul(self.support).sum(dim=2)
        # Compute argmax assuming illegal actions is a bool tensor, True if
        # action is illegal.
        illegal_mask = (-torch.inf * torch.Tensor(illegal_actions)).nan_to_num(
            nan=0, neginf=-torch.inf
        )
        q_argmax = q.add(illegal_mask).argmax(dim=1)
        logging.info(
            "Chosen move: %d (%s)",
            q_argmax[0],
            self.environment.game.get_move(int(q_argmax)).to_dict(),
        )
        return self.environment.game.get_move(int(q_argmax)).to_dict()

    def get_illegal_actions(self, legal_moves, action_dim):
        """Returns illegal moves formatted as boolean array.

        Generate array of boolean entries indicating illegal moves. Input is a
        list of indices indicating legal moves, as returned from environment
        observations.

        Example
        -------
            > illegal_moves = get_illegal_actions(legal_moves=[0, 1, 3], action_dim=5)
            > [False, False, True, False, True]

        Parameters
        ----------
        legal_moves : _type_
            List of indices of legal actions
        action_dim : int
            Number of actions

        Returns
        -------
        numpy.ndarray
            Illegal actions
        """
        illegal_moves = np.ones(action_dim, dtype=bool)
        if legal_moves:
            illegal_moves[legal_moves] = False
        return illegal_moves


if __name__ == "__main__":
    rainbow_agent = TrainedRainbowAgent(config={"rainbow_type": "aiide_all1"})
