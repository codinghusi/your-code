import { InputStream } from "../input-stream";
import { Token } from "./token";
import { CodeInputStream } from '../../your-parser/code-input-stream';
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
        return this.whitespace.charAt(this.whitespace.length - 1) !== '\n';
    }
}