import { InputStream } from "../../input-stream";
import { ParserToken } from "./parser-pattern";
import { Pattern } from "./pattern";


export class DelimiterPattern extends Pattern {
    constructor(public start: ParserToken,
                public value: ParserToken,
                public stop: ParserToken,
                public separator?: ParserToken) {
        super();
    }

    static parse(stream: InputStream) {
        stream.pushCheckPoint();
        let separator: ParserToken;
        // start parser
        const leftHandParser = ParserToken.parse(stream);
        if (!stream.matchNextString('=>')) {
            stream.popCheckPoint();
            return null;
        }
        
        // value parser
        const valueParser = ParserToken.parse(stream);
        if (!valueParser) {
            stream.croak(`the delimiter needs a value parser`);
        }

        // separator parser
        if (stream.matchNextString('|')) {
            separator = ParserToken.parse(stream);
            if (!separator) {
                stream.croak(`with a '|' you want to use a separator. But the separator is missing`);
            }
        }
        
        // stop parser
        if (!stream.matchNextString('<=')) {
            stream.croak(`you need to end the delimiter with a <= plus a stop parser`);
        }
        const rightHandParser = ParserToken.parse(stream);
        if (!rightHandParser) {
            stream.croak(`please define a stop parser`);
        }

        return new DelimiterPattern(leftHandParser, valueParser, rightHandParser, separator);
    }
}