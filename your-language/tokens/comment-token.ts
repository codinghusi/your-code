import { LanguageInputStream } from "../language-input-stream";
import { Token } from "./token";

interface Params {
    content: string;
}

export class CommentToken extends Token {
    content: string;

    constructor(params: Params) {
        super();
        Object.assign(this, params);
    }

    static parse(stream: LanguageInputStream) {
        const content = stream.matchNextRegex(/\/\/.*/);
        if (!content) {
            return;
        }
        return new CommentToken({ content });
    }
}