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
import styled from "styled-components";
import HandCard from "./HandCard";
import { Hand as HandType, toColor, toRank } from "../store";
import { Move } from "../moves";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.xs};
`;

const Title = styled.div`
    display: flex;
    justify-content: center;
`;

const CardRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing.m};
    justify-content: center;
`;

function getHighlightedCards(
    hand: HandType,
    lastMove: Move | undefined,
): boolean[] {
    if (lastMove?.action_type === "REVEAL_RANK") {
        return hand.cards.map((card) => card.rank === toRank(lastMove.rank));
    }
    if (lastMove?.action_type === "REVEAL_COLOR") {
        return hand.cards.map((card) => card.color === toColor(lastMove.color));
    }
    return hand.cards.map(() => false);
}

export interface HandProps {
    title: string;
    hand: HandType;
    playerHand: boolean;
    lastMove?: Move;
    myLastMove?: Move | undefined;
    ended: boolean;
}

export default function Hand({
    hand,
    title,
    playerHand,
    lastMove,
    myLastMove,
    ended,
}: HandProps): JSX.Element {
    const highlightedCards = getHighlightedCards(hand, lastMove);

    return (
        <Container>
            <Title>{title}</Title>
            <CardRow>
                {hand.cards.map((card, index) => (
                    <HandCard
                        key={`${JSON.stringify(card)}${index}`}
                        card={card}
                        playerHand={playerHand}
                        highlighted={highlightedCards[index]}
                        ended={ended}
                        drawn={
                            index === hand.cards.length - 1 &&
                            (myLastMove?.action_type === "PLAY" ||
                                myLastMove?.action_type === "DISCARD")
                        }
                    />
                ))}
            </CardRow>
        </Container>
    );
}
