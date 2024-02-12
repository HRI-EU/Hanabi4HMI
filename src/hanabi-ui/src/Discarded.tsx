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
import { Color, DiscardPile, Rank, toColor, toRank } from "./store";
import { Move } from "./moves";
import { useTranslation } from "react-i18next";

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const ColorsContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

interface RankContainerProps {
    $highlighted: boolean;
}
const RankContainer = styled.div<RankContainerProps>`
    border: solid
        ${(props) =>
            props.$highlighted ? props.theme.palette.error : "initial"};
`;

function shouldHighlight(
    color: Color,
    rank: Rank,
    lastMove: Move | undefined,
): boolean {
    if (
        (lastMove?.action_type === "PLAY" ||
            lastMove?.action_type === "DISCARD") &&
        toColor(lastMove.played_card?.color) === color &&
        toRank(lastMove.played_card?.rank) === rank
    ) {
        return true;
    }
    return false;
}

export interface DiscardedProps {
    discardPile: DiscardPile | null;
    lastMove: Move | undefined;
}
export default function Discarded({
    discardPile,
    lastMove,
}: DiscardedProps): JSX.Element {
    const { t } = useTranslation();
    if (discardPile === null) return <></>;

    return (
        <Container>
            <TitleContainer>
                <div>{t("discarded")}</div>
            </TitleContainer>
            <ColorsContainer>
                {Object.entries(discardPile).map(([color, ranks]) => (
                    <div key={`${JSON.stringify(color)}`}>
                        <div>{t(`color.${color}`)}</div>
                        {ranks.map((rank, index) => (
                            <RankContainer
                                key={`${rank}${index}`}
                                $highlighted={shouldHighlight(
                                    color as Color,
                                    rank,
                                    lastMove,
                                )}
                            >
                                {t(`rank.${rank}`)}
                            </RankContainer>
                        ))}
                    </div>
                ))}
            </ColorsContainer>
        </Container>
    );
}
