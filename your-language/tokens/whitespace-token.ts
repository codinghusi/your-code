import { Token } from "./token";
import { LanguageInputStream } from "../language-input-stream";


export class WhitespaceToken extends Token {
    constructor(public whitespace: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = stream.matchWhitespace();
        console.log("tested for whitespace: " + JSON.stringify(result));
        if (!result) {
            return null;
        }
        return new WhitespaceToken(result);
    }

    isIdented() {
        console.log(`checking identation: ${this.whitespace}`);
        const lastChar = this.whitespace.charAt(this.whitespace.length - 1);
        return lastChar === ' ' || '\t';
    }
}
