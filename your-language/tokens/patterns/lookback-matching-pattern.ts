import { InputStream } from "../../input-stream";
import { Pattern } from "./pattern";
import { LanguageInputStream } from "../language-input-stream";
import { ParserPattern } from "./parser-pattern";
import { StringPattern } from './string-pattern';
import { CodeInputStream } from "../../../your-parser/code-input-stream";


// TODO: add support for more complex parsers (fixed length, PatternParser)

export class LookbackMatchingPattern extends Pattern {
    constructor(public parser: StringPattern,
                public negated: boolean) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const check = stream.matchNextString('<=') ?? stream.matchNextString('<!=');
        if (!check) {
            return null;
        }
        const negated = check === '<!=';
        const parser = StringPattern.parse(stream);
        if (!stream.matchNextString('>')) {
            stream.croak(`missing closing '>'`);
        }
        return new LookbackMatchingPattern(parser, negated);
    }

    _parse(stream: CodeInputStream) {
        return stream.testOut(() => {
            stream.position -= this.parser.value.length;
            return this.parser.softParse(stream);
        });
    }

    checkFirstWorking(stream: CodeInputStream): boolean {
        return this._parse(stream);
    }
}