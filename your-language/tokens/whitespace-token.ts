import { Token } from "./token";
import { LanguageInputStream } from "../language-input-stream";


export class WhitespaceToken extends Token {
    constructor(public whitespace: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = stream.matchWhitespace();
        if (!result) {
            return null;
        }
        return new WhitespaceToken(result);
    }

    isIdented() {
        const result = /[\t ]+$/.test(this.whitespace);
        console.log("is Idented:", result, JSON.stringify(this.whitespace));
        return result;
    }
}
