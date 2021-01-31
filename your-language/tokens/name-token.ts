import { InputStream } from "../input-stream";
import { LanguageInputStream } from "../language-input-stream";
import { Token } from "./token";


export class NameToken extends Token {
    constructor(public name: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = stream.matchNextRegex(/[\w]+/i);
        if (!result) {
            return;
        }
        return new NameToken(result);
    }
}