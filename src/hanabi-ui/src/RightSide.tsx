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
/* eslint-disable no-case-declarations */
import styled from "styled-components";
import { toRank, toColor } from "./store";
import { Move } from "./moves";
import { Fragment, useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { gameState as storedGameState } from "./state";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.xs};
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const LogTable = styled.div`
    max-height: 90vh;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1.4fr 1fr;
    :nth-last-child(3) {
        border: solid ${(props) => props.theme.palette.error};
        border-right: none;
    }
    :nth-last-child(2) {
        border-top: solid ${(props) => props.theme.palette.error};
        border-bottom: solid ${(props) => props.theme.palette.error};
    }
    :last-child {
        border: solid ${(props) => props.theme.palette.error};
        border-left: none;
    }
`;

function displayName(
    player: number,
    mainPlayer: number,
    t: TFunction<"translation", undefined>,
): string {
    if (player === mainPlayer) {
        return t("you");
    }
    return `${t("player")} ${player + 1}`;
}
function displayMove(
    move: Move,
    t: TFunction<"translation", undefined>,
): [string, string] {
    switch (move.action_type) {
        case "REVEAL_RANK":
            return [
                t("revealedRank"),
                t(`rank.${toRank(move.rank).toString()}`),
            ];
        case "REVEAL_COLOR":
            return [t("revealedColor"), t(`color.${toColor(move.color)}`)];
        case "PLAY":
        case "DISCARD":
            let playedCard = move.card_index.toString();

            if (move.played_card) {
                const translatedRank = t(
                    `rank.${toRank(move.played_card.rank).toString()}`,
                );
                const translatedColor = t(
                    `color.${toColor(move.played_card.color)}`,
                );
                playedCard = `${translatedColor} ${translatedRank}`;
            }

            const str =
                move.action_type === "PLAY" ? t("played") : t("discarded");
            return [str, playedCard];
    }
}

export default function RightSide(): JSX.Element {
    const gameState = useAtomValue(storedGameState);
    const { t } = useTranslation();
    const eventLog = gameState?.eventLog ?? [];

    const player = gameState?.playerId ?? 0;

    const logTableRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (logTableRef.current) {
            logTableRef.current.scrollBy({ behavior: "smooth", top: 100000 });
        }
    });

    return (
        <Container>
            <TitleContainer>
                <div>{t("eventLog")}</div>
            </TitleContainer>
            <LogTable ref={logTableRef}>
                {Object.values(eventLog).map(
                    ({ move, player_index }, index) => {
                        const [kind, target] = displayMove(move, t);
                        return (
                            <Fragment
                                key={`${JSON.stringify(move)}${JSON.stringify(
                                    player_index,
                                )}${index}`}
                            >
                                <div>
                                    {displayName(player_index, player, t)}
                                </div>
                                <div>{kind}</div>
                                <div>{target}</div>
                            </Fragment>
                        );
                    },
                )}
            </LogTable>
        </Container>
    );
}
