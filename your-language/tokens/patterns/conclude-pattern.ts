import { ParserPattern } from "./parser-pattern";
import { Pattern } from "./pattern";
import { LanguageInputStream } from "../language-input-stream";
import { CodeInputStream } from '../../../your-parser/code-input-stream';


export class ConcludePattern extends Pattern {
    constructor(public content: ParserPattern) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        if (stream.matchNextString('(')) {
            const content = ParserPattern.parse(stream);
            if (!stream.matchNextString(')')) {
                stream.croak(`missing closing )`);
            }
            return new ConcludePattern(content);
        }
    }

    _parse(stream: CodeInputStream) {
        return this.content._parse(stream);
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.content.checkFirstWorking(stream);
    }
}