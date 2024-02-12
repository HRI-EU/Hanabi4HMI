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

import { Move } from "./moves";

export const UNKNOWN_COLOR = null;
export type UnknownColor = typeof UNKNOWN_COLOR;
export type ValidColor = "B" | "G" | "R" | "W" | "Y";
export type ObservedColor = ValidColor | UnknownColor;
export type UnknownRank = -1 | null;
export type ValidRank = 0 | 1 | 2 | 3 | 4;
export type ObservedRank = ValidRank | UnknownRank;
export interface ObservedCard {
    color: ObservedColor;
    rank: ObservedRank;
}
export type ObservedFireworks = {
    [color in ValidColor]: number;
};
export type Hand = [ObservedCard, ...ObservedCard[]];
export type Event = {
    move: Move;
    player_index: number;
};
export interface PlayerSpecificObservation {
    current_player: number;
    current_player_offset: number;
    deck_size: number;
    discard_pile: ObservedCard[] | null;
    fireworks: ObservedFireworks;
    information_tokens: number;
    legal_moves: Move[];
    life_tokens: number;
    observed_hands: [Hand, Hand, ...Hand[]];
    card_knowledge: [Hand, Hand, ...Hand[]];
    num_players: number;
    event_log: Event[];
}
export interface GameEndedEvent {
    reason: number;
    score: number;
    max_score: number;
}
