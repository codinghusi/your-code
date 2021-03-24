import { InputStream } from "../../input-stream";
import { Pattern, Type } from "./pattern";
import { LanguageInputStream } from "../../language-input-stream";
import { ParserPattern } from "./parser-pattern";
import { StringPattern } from './string-pattern';
import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { TokenCapture } from "../../token-capture";


// TODO: add support for more complex parsers (fixed length, PatternParser)

@Type("lookback-matching")
export class LookbackMatchingPattern extends Pattern {
    constructor(capture: TokenCapture,
                public parser: StringPattern,
                public negated: boolean) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const check = stream.matchNextString('<=') ?? stream.matchNextString('<!=');
        if (!check) {
            return null;
        }
        const negated = check === '<!=';
        const parser = StringPattern.parse(stream);
        if (!stream.matchNextString('>')) {
            stream.croak(`missing closing '>'`);
        }
        return new LookbackMatchingPattern(capture.finish(), parser, negated);
    }

    parse(stream: CodeInputStream) {
        return stream.testOut(() => {
            stream.position -= this.parser.value.length;
            return this.parser.softParse(stream);
        });
    }

    checkFirstWorking(stream: CodeInputStream): boolean {
        return this.parse(stream);
    }
}