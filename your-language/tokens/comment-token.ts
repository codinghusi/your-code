import { LanguageInputStream } from "../language-input-stream";
import { Token } from "./token";


export class CommentToken extends Token {
    constructor(public content: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = stream.matchNextRegex(/\/\/.*/);
        if (!result) {
            return;
        }
        return new CommentToken(result);
    }
}