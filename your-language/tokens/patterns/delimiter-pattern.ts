import { Pattern, Type } from "./pattern";
import { LanguageInputStream } from "../../language-input-stream";
import { ParserPattern } from "./parser-pattern";
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { TokenCapture } from "../../token-capture";


@Type("delimiter")
export class DelimiterPattern extends Pattern {
    constructor(capture: TokenCapture,
                public value: ParserPattern,
                public separator?: ParserPattern) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();

        // check if it delimiter
        if (!stream.matchNextString('=>')) {
            return null;
        }
        stream.matchWhitespace();

        let separator: ParserPattern;
        
        // value parser
        const valueParser = ParserPattern.parse(stream);
        if (!valueParser) {
            stream.croak(`the delimiter needs a value parser`);
        }

        // separator parser
        stream.matchWhitespace();
        if (stream.matchNextString('|')) {
            stream.matchWhitespace();
            separator = ParserPattern.parse(stream);
            if (!separator) {
                stream.croak(`with a '|' you want to use a separator. But you forgot the separator`);
            }
        }
        
        // stop parser
        stream.matchWhitespace();
        if (!stream.matchNextString('<=')) {
            stream.croak(`you need to end the delimiter with a <= plus a stop parser`);
        }

        return new DelimiterPattern(capture.finish(), valueParser, separator);
    }

    parse(stream: CodeInputStream) {
        const values = [];
        let first = true;

        stream.tempNextPattern(this.separator, () => {
            
            // collect values
            while (true) {

                // separator
                if (this.separator) {
                    const separator = this.separator.softParse(stream);
                    if (!separator && !first) {
                        break;
                    }
                    first = false;
                }
                
                // value
                const value = this.value.softParse(stream);
                if (!value) {
                    break;
                }
                values.push(value);
            }
        });

        // merge all results into arrays
        const result = {};
        values.forEach(item => {
            Object.keys(item).forEach(key => {
                if (!(key in result)) {
                    result[key] = [];
                }
                const value = item[key];
                result[key].push(value);
            });
        });

        return result;
    }

    checkFirstWorking(stream: CodeInputStream) {
        return !!this.value.softParse(stream);
    }
}