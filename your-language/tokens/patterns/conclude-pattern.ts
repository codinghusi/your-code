import { ParserPattern } from "./parser-pattern";
import { Pattern, Type } from "./pattern";
import { LanguageInputStream } from "../../language-input-stream";
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { TokenCapture } from "../../token-capture";


@Type("conclude")
export class ConcludePattern extends Pattern {
    constructor(capture: TokenCapture,
                public content: ParserPattern) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        if (stream.matchNextString('(')) {
            const content = ParserPattern.parse(stream);
            if (!stream.matchNextString(')')) {
                stream.croak(`missing closing )`);
            }
            return new ConcludePattern(capture.finish(), content);
        }
    }

    parse(stream: CodeInputStream) {
        return this.namings.onToResult(this.content.parse(stream), true);
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.content.checkFirstWorking(stream);
    }
}