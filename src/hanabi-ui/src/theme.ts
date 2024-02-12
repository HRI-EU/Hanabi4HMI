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

import { DefaultTheme } from "styled-components";
import { Color } from "./store";

function spacing(factor: number) {
    return `${8 * factor}px`;
}

const theme: DefaultTheme = {
    spacing: {
        xxs: spacing(0.5),
        xs: spacing(1),
        s: spacing(2),
        m: spacing(4),
        l: spacing(8),
        xl: spacing(16),
    },
    shape: {
        borderRadius: "4px",
    },
    palette: {
        card: {
            color: {
                "?": "#212121",
                Blue: "#4eb7ff",
                White: "white",
                Green: "#1fd11b",
                Red: "#fb3f38",
                Yellow: "yellow",
            },
            background: "#212121",
        },
        background: "#e0e0e0",
        primary: "#BCECE0", // Tiffany Blue
        secondary: "#36EEE0", // Cyan
        error: "#F652A0", // Hot Pink
        other: "#4C5270", // Cornflower
    },
};
export default theme;

declare module "styled-components" {
    export interface DefaultTheme {
        spacing: {
            xxs: string;
            xs: string;
            s: string;
            m: string;
            l: string;
            xl: string;
        };
        shape: {
            borderRadius: string;
        };
        palette: {
            card: { color: Record<Color, string>; background: string };
            background: string;
            primary: string;
            secondary: string;
            error: string;
            other: string;
        };
    }
}
