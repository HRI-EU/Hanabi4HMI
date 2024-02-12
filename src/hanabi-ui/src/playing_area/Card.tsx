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
import { ReactNode } from "react";
import { Color } from "../store";
import { styled } from "styled-components";
import CardImage from "./CardImage";
import { useTranslation } from "react-i18next";

interface ContainerProps {
    $highlighted?: boolean;
}
const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${(props) => props.theme.palette.card.background};
    border-radius: 4px;
    width: 100px;
    height: 141px;
    border: ${(props) =>
        props.$highlighted ? `solid ${props.theme.palette.error}` : "initial"};
`;

interface DrawnProps {
    $drawn?: boolean;
}

const Drawn = styled.div<DrawnProps>`
    border: ${(props) =>
        props.$drawn ? `solid ${props.theme.palette.secondary}` : "initial"};
    border-radius: 4px;
`;
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding-left: ${(props) => props.theme.spacing.xxs};
    padding-right: ${(props) => props.theme.spacing.xxs};
`;

interface ColorProps {
    $hinted: boolean | undefined;
    color: Color;
}
const ColorDisplay = styled.div<ColorProps>`
    color: ${(props) => props.theme.palette.card.color[props.color]};
    border: ${(props) =>
        props.$hinted ? `solid ${props.theme.palette.error}` : "initial"};
`;

export interface CardProps {
    number: number | string;
    numberHinted?: boolean;
    color: Color;
    colorHinted?: boolean;
    children?: ReactNode;
    highlighted?: boolean;
    drawn?: boolean;
}

export default function Card({
    number,
    numberHinted,
    highlighted,
    color,
    colorHinted,
    children,
    drawn,
}: CardProps): JSX.Element {
    const { t } = useTranslation();
    return (
        <Drawn $drawn={drawn}>
            <Container $highlighted={highlighted}>
                <Header>
                    <ColorDisplay color={color as Color} $hinted={numberHinted}>
                        {t(`rank.${number}`)}
                    </ColorDisplay>
                    <ColorDisplay color={color as Color} $hinted={colorHinted}>
                        {t(`color.${color}`)}
                    </ColorDisplay>
                </Header>
                <CardImage color={color} number={number} />
                {children}
            </Container>
        </Drawn>
    );
}
