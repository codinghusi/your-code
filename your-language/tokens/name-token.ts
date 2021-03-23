import { InputStream } from "../input-stream";
import { LanguageInputStream } from "../language-input-stream";
import { Token } from "./token";

interface Params {
    name: string;
}

export class NameToken extends Token {
    name: string;

    constructor(params: Params) {
        super();
        Object.assign(this, params);
    }

    static parse(stream: LanguageInputStream) {
        const name = stream.matchNextRegex(/[\w]+/i);
        if (!name) {
            return;
        }
        return new NameToken({ name });
    }
}