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

import { Socket, io } from "socket.io-client";
import {
    Color,
    DiscardPile,
    Fireworks,
    Hand,
    Rank,
    toColor,
    toRank,
    GameState as StateGameState,
} from "../store";
import {
    GameEndedEvent,
    ObservedCard,
    ObservedFireworks,
    Hand as ObservedHand,
    PlayerSpecificObservation,
    UNKNOWN_COLOR,
} from "../observations";
import { Move, RevealColor, isPlayMoveOrDiscardMove } from "../moves";
import {
    gameEndedEvent,
    store as newStore,
    gameState as storedGameState,
} from "../state";

interface GameState {
    player_id: number;
    observation: PlayerSpecificObservation;
}

interface GameStateListener {
    (gameState: GameState): unknown;
}

interface GameEndedListener {
    (event: GameEndedEvent): unknown;
}
interface ListenEvents {
    game_state: GameStateListener;
    game_ended: GameEndedListener;
}

interface MoveEventListener {
    (move: Move): unknown;
}
interface SendEvents {
    move: MoveEventListener;
}

function empty() {
    return [];
}
function emptyArray(length: number) {
    return Array(length).fill(0).map(empty);
}
function getLegalMovesByHand(moves: Move[], nHands: number): Move[][] {
    const ret: Move[][] = emptyArray(nHands);
    for (const move of moves) {
        if (isPlayMoveOrDiscardMove(move)) {
            ret[0].push(move);
        } else {
            ret[move.target_offset].push(move);
        }
    }
    return ret;
}

function isRevealColor(move: Move): move is RevealColor {
    return move.action_type === "REVEAL_COLOR";
}

function getLegalMovesByCard(moves: Move[], hand: ObservedHand): Move[][] {
    const ret: Move[][] = emptyArray(hand.length);
    for (const move of moves) {
        if (isPlayMoveOrDiscardMove(move)) {
            ret[move.card_index].push(move);
        } else if (isRevealColor(move)) {
            hand.forEach((card, cardIndex) => {
                if (card.color === move.color) {
                    ret[cardIndex].push(move);
                }
            });
        } else {
            hand.forEach((card, cardIndex) => {
                if (card.rank === move.rank) {
                    ret[cardIndex].push(move);
                }
            });
        }
    }
    return ret;
}

function mapHand(
    hand: ObservedHand,
    legalMoves: Move[],
    cardKnowledge: ObservedHand,
): Hand {
    const legalMovesByCard = getLegalMovesByCard(legalMoves, hand);
    return {
        cards: zipTwo(hand, cardKnowledge).map(([card, knowledge], index) => ({
            color: toColor(card.color),
            rank: toRank(card.rank),
            hintedRank: toRank(knowledge.rank) !== Rank.UNKNOWN,
            hintedColor: knowledge.color !== UNKNOWN_COLOR,
            legalMoves: legalMovesByCard[index],
        })),
    };
}

function zipTwo<T, U>(t: T[], u: U[]): [T, U][] {
    const ret: [T, U][] = [];
    for (let i = 0; i < t.length && i < u.length; i++) {
        ret.push([t[i], u[i]]);
    }
    return ret;
}

function zip<T, U, V>(t: T[], u: U[], v: V[]): [T, U, V][] {
    const ret: [T, U, V][] = [];
    for (let i = 0; i < t.length && i < u.length && i < v.length; i++) {
        ret.push([t[i], u[i], v[i]]);
    }
    return ret;
}

function mapToDiscardPile(discard: ObservedCard[] | null): DiscardPile | null {
    if (discard === null) {
        return null;
    }

    const ret: DiscardPile = {
        Blue: [],
        Green: [],
        Red: [],
        White: [],
        Yellow: [],
    };
    for (const card of discard) {
        const rank = toRank(card.rank);
        const color = toColor(card.color);
        if (color !== Color.UNKNOWN && rank !== Rank.UNKNOWN) {
            ret[color].push(rank);
        }
    }
    for (const ranks of Object.values(ret)) {
        ranks.sort();
    }
    return ret;
}

function mapFireworks(fireworks: ObservedFireworks): Fireworks {
    return {
        Blue: fireworks.B,
        Green: fireworks.G,
        Red: fireworks.R,
        White: fireworks.W,
        Yellow: fireworks.Y,
    };
}

const playerId = Number.parseInt(window.location.pathname.slice(1)) - 1;

function mapToStore(observation: PlayerSpecificObservation): StateGameState {
    const nHands = observation.observed_hands.length;
    const legalMovesByHand = getLegalMovesByHand(
        observation.legal_moves,
        nHands,
    );

    const myHand = mapHand(
        observation.card_knowledge[0],
        legalMovesByHand[0],
        observation.observed_hands[0],
    );
    const otherPlayerHands = zip(
        observation.observed_hands.slice(1),
        legalMovesByHand.slice(1),
        observation.card_knowledge.slice(1),
    ).map(([hand, legalMoves, cardKnowledge]) =>
        mapHand(hand, legalMoves, cardKnowledge),
    );

    const currentPlayerIndex = observation.current_player;

    return {
        playerId,
        currentPlayerIndex,
        myHand,
        otherPlayerHands,
        fireworks: mapFireworks(observation.fireworks),
        informationTokens: observation.information_tokens,
        lifeTokens: observation.life_tokens,
        deckSize: observation.deck_size,
        discardPile: mapToDiscardPile(observation.discard_pile),
        eventLog: observation.event_log,
        gameOverEvent: null,
    };
}

let socket: Socket<ListenEvents, SendEvents>;
export function init() {
    socket = io(`ws://${window.location.host}`);
    socket.on("connect", () => {
        console.log("socket connected: ", socket.connected);
    });
    socket.on("game_state", (gameState) => {
        if (gameState.player_id !== playerId) {
            return;
        }
        const toStoreStore = mapToStore(gameState.observation);
        newStore.set(storedGameState, toStoreStore);
    });
    socket.on("game_ended", (event) => {
        console.log("game ended: ", event);
        newStore.set(gameEndedEvent, event);
    });
}
export function makeMove(move: Move) {
    socket.emit("move", move);
}
