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
import { useEffect } from "react";
import Middle from "./playing_area/Middle";
import styled, { createGlobalStyle } from "styled-components";
import { init } from "./client/init";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";
import HanabiFireworks from "./GameOver";
import logo from "./logo.png";

const GlobalStyle = createGlobalStyle`
body {
    background-color: ${(props) => props.theme.palette.background};
    background-image: url(${logo});
    background-repeat: no-repeat;
    background-position: bottom left ${(props) => props.theme.spacing.xxs};
min-height: 98vh;
}
`;

const Container = styled.div`
    display: grid;
    grid-template-columns: 15fr 70fr 15fr;
`;

export default function App(): JSX.Element {
    useEffect(() => {
        init();
    }, []);
    return (
        <>
            <Container>
                <GlobalStyle />
                <LeftSide />
                <Middle />
                <RightSide />
            </Container>
            <HanabiFireworks />
        </>
    );
}
