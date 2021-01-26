import { LanguageInputStream } from "./language-input-stream";
import { Token } from "./token";


export class CommentToken extends Token {
    constructor(public content: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = stream.matchNextRegex(/\/\/.*/, undefined, undefined, false);
        return new CommentToken(result);
    }
}