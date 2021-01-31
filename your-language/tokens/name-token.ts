import { InputStream } from "../input-stream";
import { Token } from "./token";


export class NameToken extends Token {
    constructor(public name: string) {
        super();
    }

    static parse(stream: InputStream) {
        const result = stream.matchNextRegex(/[\w]+/i);
        if (!result) {
            return;
        }
        return new NameToken(result);
    }
}