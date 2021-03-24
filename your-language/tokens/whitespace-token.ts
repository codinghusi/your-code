import { Token } from "./token";
import { LanguageInputStream } from "../language-input-stream";
import { TokenCapture } from "../token-capture";


export class WhitespaceToken extends Token {
    constructor(capture: TokenCapture,
                public whitespace: string) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = stream.matchWhitespace();
        if (!result) {
            return null;
        }
        return new WhitespaceToken(capture.finish(), result);
    }

    isIdented() {
        const result = /[\t ]+$/.test(this.whitespace);
        return result;
    }
}
