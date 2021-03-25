import { DelimiterPattern } from "../patterns/delimiter-pattern";
import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../parser";
import { PatternChainPattern } from "../patterns/pattern-chain-pattern";
import { Patterns } from "./parsers";

export class DelimiterParser extends LanguageParser<DelimiterPattern> {
    async parseIntern(stream: LanguageInputStream) {
        // check if it delimiter
        if (!stream.matchNextString('=>')) {
            return null;
        }
        stream.matchWhitespace();

        let separator: PatternChainPattern;
        
        // value parser
        const valueParser = await Patterns.chained(stream);
        if (!valueParser) {
            stream.croak(`the delimiter needs a value parser`);
        }

        // separator parser
        stream.matchWhitespace();
        if (stream.matchNextString('|')) {
            stream.matchWhitespace();
            separator = await Patterns.chained(stream)
            if (!separator) {
                stream.croak(`with a '|' you want to use a separator. But you forgot the separator`);
            }
        }
        
        // stop parser
        stream.matchWhitespace();
        if (!stream.matchNextString('<=')) {
            stream.croak(`you need to end the delimiter with a <= plus a stop parser`);
        }

        return new DelimiterPattern(valueParser, separator);
    }
}