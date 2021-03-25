import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../parser";
import { LanguagePattern } from "../pattern";
import { PatternChainPattern } from "../patterns/pattern-chain-pattern";
import { Patterns } from "./parsers";

export class PatternChainParser extends LanguageParser<PatternChainPattern> {
    // static parsers = [
    //     StringPattern.parse,
    //     RegexPattern.parse,
    //     VariablePattern.parse,
    //     FunctionPattern.parse,
    //     ConcludePattern.parse,
    //     ChoicePattern.parse,
    //     LookbackMatchingPattern.parse
    // ];
    
    parsePattern(stream: LanguageInputStream) {
        const namings = Namings.parse(stream);
        stream.matchWhitespace();
        for (const parser of this.parsers) {
            const pattern = parser(stream);
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
            
            const pattern = this.parsePattern(stream);
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