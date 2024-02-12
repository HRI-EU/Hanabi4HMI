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
import Card from "./Card";
import { Card as CardType } from "../store";
import { makeMove } from "../client/init";
import { Move } from "../moves";
import { useTranslation } from "react-i18next";

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.xxs};
`;

type PossibleLegalMovesMap = {
    play: Move | undefined;
    discard: Move | undefined;
    rank: Move | undefined;
    color: Move | undefined;
};

function getOnClick(move: Move | undefined): () => void {
    if (move === undefined) {
        return () => undefined;
    }
    return () => makeMove(move);
}

function isLegalMove(moves: Move[]): PossibleLegalMovesMap {
    return {
        play: moves.find((move) => move.action_type === "PLAY"),
        discard: moves.find((move) => move.action_type === "DISCARD"),
        rank: moves.find((move) => move.action_type === "REVEAL_RANK"),
        color: moves.find((move) => move.action_type === "REVEAL_COLOR"),
    };
}

export interface HandCardProps {
    card: CardType;
    playerHand: boolean;
    highlighted?: boolean;
    ended: boolean;
    drawn?: boolean;
}

export default function HandCard({
    card,
    playerHand,
    highlighted,
    ended,
    drawn,
}: HandCardProps): JSX.Element {
    const legal = isLegalMove(card.legalMoves);
    const { t } = useTranslation();

    const buttons = playerHand ? (
        <>
            <button
                onClick={getOnClick(legal.play)}
                disabled={ended || legal.play === undefined}
            >
                {t("play")}
            </button>
            <button
                onClick={getOnClick(legal.discard)}
                disabled={ended || legal.discard === undefined}
            >
                {t("discard")}
            </button>
        </>
    ) : (
        <>
            <button
                onClick={getOnClick(legal.rank)}
                disabled={ended || legal.rank === undefined}
            >
                {t("hintRank")}
            </button>
            <button
                onClick={getOnClick(legal.color)}
                disabled={ended || legal.color === undefined}
            >
                {t("hintColor")}
            </button>
        </>
    );

    return (
        <Card
            number={card.rank}
            numberHinted={card.hintedRank}
            color={card.color}
            colorHinted={card.hintedColor}
            highlighted={highlighted}
            drawn={drawn}
        >
            <ButtonContainer>{buttons}</ButtonContainer>
        </Card>
    );
}
