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
import {
    Color,
    Fireworks as FireworksType,
    Rank,
    toColor,
    toRank,
} from "../store";
import { Move } from "../moves";
import { useTranslation } from "react-i18next";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.xs};
`;
const CardsContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${(props) => props.theme.spacing.l};
    justify-content: center;
`;
const Title = styled.div`
    display: flex;
    justify-content: center;
`;

function shouldHighlight(
    color: Color,
    rank: Rank,
    lastMove: Move | undefined,
): boolean {
    return (
        lastMove?.action_type === "PLAY" &&
        !!lastMove.played_card &&
        toColor(lastMove.played_card.color) === color &&
        toRank(lastMove.played_card.rank) === rank
    );
}

export interface FireworksProps {
    fireworks: FireworksType;
    lastMove?: Move | undefined;
}

export default function Fireworks({
    fireworks,
    lastMove,
}: FireworksProps): JSX.Element {
    const { t } = useTranslation();
    return (
        <Container>
            <Title>{t("board")}</Title>
            <CardsContainer>
                {Object.entries(fireworks).map(([color, number]) => (
                    <Card
                        key={`${JSON.stringify(color)}${JSON.stringify(
                            number,
                        )}`}
                        number={number}
                        color={color as Color}
                        highlighted={shouldHighlight(
                            color as Color,
                            number,
                            lastMove,
                        )}
                    />
                ))}
            </CardsContainer>
        </Container>
    );
}
