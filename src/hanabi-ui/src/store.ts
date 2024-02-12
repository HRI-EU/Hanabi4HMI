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

import {
    Event,
    GameEndedEvent,
    ObservedColor,
    ObservedRank,
} from "./observations";
import { Move } from "./moves";

export const enum Rank {
    UNKNOWN = "?",
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}
export function toRank(rank: ObservedRank | undefined): Rank {
    switch ((rank ?? -1) + 1) {
        case Rank.ONE:
            return Rank.ONE;
        case Rank.TWO:
            return Rank.TWO;
        case Rank.THREE:
            return Rank.THREE;
        case Rank.FOUR:
            return Rank.FOUR;
        case Rank.FIVE:
            return Rank.FIVE;
        default:
            return Rank.UNKNOWN;
    }
}

export const enum Color {
    UNKNOWN = "?",
    BLUE = "Blue",
    GREEN = "Green",
    RED = "Red",
    WHITE = "White",
    YELLOW = "Yellow",
}
export function toColor(color: ObservedColor | undefined): Color {
    switch (color) {
        case "B":
            return Color.BLUE;
        case "G":
            return Color.GREEN;
        case "R":
            return Color.RED;
        case "W":
            return Color.WHITE;
        case "Y":
            return Color.YELLOW;
        default:
            return Color.UNKNOWN;
    }
}

export interface Card {
    color: Color;
    rank: Rank;
    hintedRank: boolean;
    hintedColor: boolean;
    legalMoves: Move[];
}

export interface Hand {
    cards: Card[];
}

type ValidColor = Exclude<Color, Color.UNKNOWN>;
export type DiscardPile = Record<ValidColor, Rank[]>;

export type Fireworks = Record<ValidColor, number>;
export interface GameState {
    playerId: number;
    currentPlayerIndex: number;
    myHand: Hand;
    otherPlayerHands: Hand[];
    fireworks: Fireworks;
    informationTokens: number;
    lifeTokens: number;
    deckSize: number;
    discardPile: DiscardPile | null;
    eventLog: Event[];
    gameOverEvent: GameEndedEvent | null;
}

export interface Store {
    gameState: GameState | null;
}
