import { InputStream } from "../input-stream";
import { Token } from "./token";


export class CommentToken extends Token {
    constructor(public content: string) {
        super();
    }

    static parse(stream: InputStream) {
        const result = stream.matchNextRegex(/\/\/.*/);
        return new CommentToken(result);
    }
}