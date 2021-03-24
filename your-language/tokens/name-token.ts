import { LanguageInputStream } from "../language-input-stream";
import { TokenCapture } from "../token-capture";
import { Token } from "./token";


export class NameToken extends Token {
    constructor(capture: TokenCapture,
                public name: string) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = stream.matchNextRegex(/[\w]+/i);
        if (!result) {
            return;
        }
        return new NameToken(capture.finish(), result);
    }
}