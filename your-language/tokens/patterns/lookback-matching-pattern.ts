import { Pattern } from "./pattern";
import { LanguageInputStream } from "../../language-input-stream";
import { StringPattern } from './string-pattern';
import { CodeInputStream } from "../../../your-parser/code-input-stream";


// TODO: add support for more complex parsers (fixed length, PatternParser)

interface Params {
    parser: StringPattern;
    negated: boolean;
}

export class LookbackMatchingPattern extends Pattern {
    parser: StringPattern;
    negated: boolean;
    
    constructor(params: Params) {
        super();
        Object.assign(this, params);
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
        return new LookbackMatchingPattern({ parser, negated });
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