import { LanguageInputStream } from "../language-input-stream";
import { TokenCapture } from "../token-capture";
import { Token } from "./token";


export class CommentToken extends Token {
    constructor(capture: TokenCapture,
                public content: string) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = stream.matchNextRegex(/\/\/.*/);
        if (!result) {
            return;
        }
        return new CommentToken(capture.finish(), result);
    }
}