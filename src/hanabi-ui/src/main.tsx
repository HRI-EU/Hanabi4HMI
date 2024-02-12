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
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "styled-components";
import theme from "./theme.ts";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true,
        interpolation: { escapeValue: false },
        resources: {
            en: {
                translation: {
                    eventLog: "Event Log",
                    revealedRank: "revealed rank",
                    revealedColor: "revealed color",
                    you: "You",
                    player: "Player",
                    rank: {
                        0: "0",
                        1: "1",
                        2: "2",
                        3: "3",
                        4: "4",
                        5: "5",
                        "?": "?",
                    },
                    color: {
                        "?": "?",
                        Blue: "Blue",
                        Green: "Green",
                        Red: "Red",
                        White: "White",
                        Yellow: "Yellow",
                    },
                    informationTokensLeft: "Information Tokens left",
                    lifeTokensLeft: "Life Tokens left",
                    deckSize: "Deck Size",
                    yourTurn: "Your Turn",
                    turn: "Turn",
                    yourPoints: "Your Points",
                    discarded: "Discarded",
                    otherPlayer: "Other Player",

                    play: "Play",
                    discard: "Discard",
                    hintRank: "Hint Rank",
                    hintColor: "Hint Color",

                    board: "Board",
                },
            },
            de: {
                translation: {
                    eventLog: "Ereignisprotokoll",
                    revealedRank: "Zahlen-Hinweis gegeben für",
                    revealedColor: "Farb-Hinweis gegeben für",
                    you: "Du",
                    player: "Spieler",
                    rank: {
                        0: "0",
                        1: "1",
                        2: "2",
                        3: "3",
                        4: "4",
                        5: "5",
                        "?": "?",
                    },
                    color: {
                        "?": "?",
                        Blue: "Blau",
                        Green: "Grün",
                        Red: "Rot",
                        White: "Weiß",
                        Yellow: "Gelb",
                    },
                    informationTokensLeft: "Hinweis-Plättchen übrig",
                    lifeTokensLeft: "Gewitter-Plättchen übrig",
                    deckSize: "Deck Size",
                    yourTurn: "Du bist am Zug",
                    turn: "am Zug",
                    yourPoints: "Punkte",
                    discarded: "Discarded",
                    otherPlayer: "Anderer Spieler",

                    play: "Spielen",
                    discard: "Wegwerfen",
                    hintRank: "Gib Zahlen-Hinweis",
                    hintColor: "Gib Farb-Hinweis",

                    board: "Feuerwerke",
                },
            },
        },
    });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
);
