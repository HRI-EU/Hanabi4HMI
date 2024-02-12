//
//  Copyright (c) Honda Research Institute Europe GmbH
//
//  Redistribution and use in source and binary forms, with or without  modification, are permitted provided that the following conditions are
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
import Hand from "./Hand";
import Fireworks from "./Fireworks";
import { useAtomValue } from "jotai";
import { gameState as storedGameState } from "../state";
import { useTranslation } from "react-i18next";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.xl};
`;

export default function Middle(): JSX.Element {
    const gameState = useAtomValue(storedGameState);
    const { t } = useTranslation();

    if (gameState === null) {
        return <></>;
    }

    const lastEvent = gameState.eventLog.at(-1);
    const otherPlayerMove =
        lastEvent?.player_index !== gameState.playerId
            ? lastEvent?.move
            : undefined;
    const reversed = [...gameState.eventLog].reverse();
    const myMove = reversed.find(
        (move) => move.player_index === gameState.playerId,
    )?.move;

    const ended =
        gameState.gameOverEvent !== null &&
        gameState.gameOverEvent !== undefined;

    return (
        <Container>
            {gameState.otherPlayerHands.map((hand, index) => (
                <Hand
                    key={`${JSON.stringify(hand)}${index}`}
                    title={t("otherPlayer")}
                    hand={hand}
                    playerHand={false}
                    ended={ended}
                />
            ))}
            <Fireworks
                fireworks={gameState.fireworks}
                lastMove={lastEvent?.move}
            />
            <Hand
                title={t("you")}
                hand={gameState.myHand}
                playerHand={true}
                lastMove={otherPlayerMove}
                myLastMove={myMove}
                ended={ended}
            />
        </Container>
    );
}
