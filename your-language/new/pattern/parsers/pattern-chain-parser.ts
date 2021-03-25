import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../parser";
import { LanguagePattern } from "../pattern";
import { PatternChainPattern } from "../patterns/pattern-chain-pattern";
import { NamingCollectionParser } from "./namings/naming-collection-parser";
import { Patterns } from "./all-patterns";

export class PatternChainParser extends LanguageParser<PatternChainPattern> {
    namingCollectionParser = new NamingCollectionParser();
    
    async parsePattern(stream: LanguageInputStream) {
        const parsers = [
            Patterns.string,
            Patterns.regex,
            Patterns.variable,
            Patterns.function,
            Patterns.conclude,
            Patterns.choice,
            Patterns.lookback
        ];

        const namings = await this.namingCollectionParser.parse(stream);
        stream.matchWhitespace();
        for (const parser of parsers) {
            const pattern = await parser(stream);
            if (pattern) {
                pattern.setNamings(namings);
                return pattern;
            }
        }
        return null;
    }
    
    async parseIntern(stream: LanguageInputStream) {
        const patterns: LanguagePattern[] = [];
        while (true) {
            // separation
            stream.pushCheckpoint();
            stream.matchWhitespace();
            const separator = await Patterns.separator(stream);
            if (!separator) {
                
                // delimiter
                stream.matchWhitespace();
                const delimiter = await Patterns.delimiter(stream);
                if (delimiter) {
                    patterns.push(delimiter);
                    stream.applyCheckPoint();
                } else {
                    
                    // both, separator and delimiter not set
                    if (patterns.length) {
                        // TODO: add 'latest error'. If nothing works, that can be displayed
                        // example for error: 'you need to separate patterns' (maybe)
                        stream.popCheckpoint();
                        break;
                    }               
                }
            }

            stream.pushCheckpoint();
            stream.matchWhitespace();
            
            const pattern = await this.parsePattern(stream);
            if (!pattern) {
                if (separator) {
                    stream.croak(`trailing separators aren't allowed`);
                }
                stream.popCheckpoint();
                break;
            }

            pattern.setSeparator(separator);
            patterns.push(pattern);
            stream.applyCheckPoint();
        }
        if (!patterns.length) {
            return null;
        }
        return new PatternChainPattern(patterns);
    }
}