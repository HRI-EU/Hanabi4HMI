//
//  Copyright (c) Honda Research Institute Europe GmbH
//
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are
//  met:
//
//  1. Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its
//     contributors may be used to endorse or promote products derived from
//     this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
//  IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
//  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
//  PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
//  CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
//  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
//  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
//  PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
//  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//

import { ObservedCard, ValidColor, ValidRank } from "./observations";

export function isPlayMoveOrDiscardMove(
    move: Move,
): move is PlayMove | DiscardMove {
    return ["PLAY", "DISCARD"].includes(move.action_type);
}

export const UNKNOWN_PLAYED_CARD = null;
export type UnknownPlayedCard = typeof UNKNOWN_PLAYED_CARD;

export interface PlayMove {
    action_type: "PLAY";
    card_index: number;
    played_card: ObservedCard | UnknownPlayedCard;
}
export interface DiscardMove {
    action_type: "DISCARD";
    card_index: number;
    played_card: ObservedCard | UnknownPlayedCard;
}
export interface RevealColor {
    action_type: "REVEAL_COLOR";
    color: ValidColor;
    target_offset: number;
}
export interface RevealRank {
    action_type: "REVEAL_RANK";
    rank: ValidRank;
    target_offset: number;
}
export type RevealMove = RevealColor | RevealRank;
export type PlayerMove = PlayMove | DiscardMove;
export type Move = PlayerMove | RevealMove;
