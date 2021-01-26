import { Pattern } from "./pattern";
import { LanguageInputStream } from "../language-input-stream";
import { ParserPattern } from "./parser-pattern";


export class DelimiterPattern extends Pattern {
    constructor(public start: ParserPattern,
                public value: ParserPattern,
                public stop: ParserPattern,
                public separator?: ParserPattern) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        stream.pushCheckPoint();
        let separator: ParserPattern;
        // start parser
        const leftHandParser = ParserPattern.parse(stream);
        if (!stream.matchNextString('=>')) {
            stream.popCheckPoint();
            return null;
        }
        
        // value parser
        const valueParser = ParserPattern.parse(stream);
        if (!valueParser) {
            stream.croak(`the delimiter needs a value parser`);
        }

        // separator parser
        if (stream.matchNextString('|')) {
            separator = ParserPattern.parse(stream);
            if (!separator) {
                stream.croak(`with a '|' you want to use a separator. But the separator is missing`);
            }
        }
        
        // stop parser
        if (!stream.matchNextString('<=')) {
            stream.croak(`you need to end the delimiter with a <= plus a stop parser`);
        }
        const rightHandParser = ParserPattern.parse(stream);
        if (!rightHandParser) {
            stream.croak(`please define a stop parser`);
        }

        return new DelimiterPattern(leftHandParser, valueParser, rightHandParser, separator);
    }
}