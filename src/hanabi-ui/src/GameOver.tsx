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

import { styled } from "styled-components";
import { Fireworks as FireworksComponent } from "@fireworks-js/react";
import { useAtomValue } from "jotai";
import { gameEndedEvent } from "./state";
import { useTranslation } from "react-i18next";

const Container = styled.div`
    display: flex;
`;

const Points = styled.div`
    position: absolute;
    color: ${(props) => props.theme.palette.error};
    font-size: 7em;
    top: 5vh;
    left: 5vw;
`;

export default function Fireworks(): JSX.Element {
    const gameOverEvent = useAtomValue(gameEndedEvent);
    const { t } = useTranslation();

    if (gameOverEvent === null) {
        return <></>;
    }
    const event = gameOverEvent;

    const relativeScore = event.score / event.max_score;

    const intensity = 60 * relativeScore;
    const explosion = 100 * relativeScore;
    const particles = 200 * relativeScore;
    const opacity = 0.9 - 0.5 * relativeScore;

    return (
        <Container>
            <FireworksComponent
                style={{
                    width: "99vw",
                    height: "99vh",
                    position: "absolute",
                    background: "#3f3f3f",
                    opacity: 0.8,
                    overflow: "hidden",
                    top: 0,
                }}
                options={{
                    opacity,
                    intensity,
                    particles,
                    explosion,
                    brightness: {
                        max: 100,
                        min: 0,
                    },
                    lineWidth: {
                        explosion: {
                            min: 3,
                            max: 6,
                        },
                    },
                }}
                key={"GameEndedFireworks"}
            ></FireworksComponent>
            <Points>
                {t("yourPoints")}: {event.score} / {event.max_score}
            </Points>
        </Container>
    );
}
