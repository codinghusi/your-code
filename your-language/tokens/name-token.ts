import { InputStream } from "../input-stream";
import { Token } from "./token";


export class NameToken extends Token {
    constructor(public name: string) {
        super();
    }

    static parse(stream: InputStream) {
        if (stream.matchNextRegex(/[a-z_]/i)) {
            const result = stream.matchNextRegex(/[\w]+/i);
            return new NameToken(result);
        }
        return null;
    }
}