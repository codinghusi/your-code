import { Token } from "./token";
import { LanguageInputStream } from "../language-input-stream";

interface Params {
    whitespace: string;
}

export class WhitespaceToken extends Token {
    whitespace: string;

    constructor(params: Params) {
        super();
        Object.assign(this, params);
    }

    static parse(stream: LanguageInputStream) {
        const whitespace = stream.matchWhitespace();
        if (!whitespace) {
            return null;
        }
        return new WhitespaceToken({ whitespace });
    }

    isIdented() {
        const result = /[\t ]+$/.test(this.whitespace);
        return result;
    }
}
