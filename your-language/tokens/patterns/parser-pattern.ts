import { LanguageInputStream } from "../language-input-stream";
import { ChoicePattern } from "./choice-pattern";
import { ConcludePattern } from "./conclude-pattern";
import { DelimiterPattern } from "./delimiter-pattern";
import { FunctionPattern } from "./function-pattern";
import { Namings } from "./namings";
import { Pattern } from "./pattern";
import { RegexPattern } from "./regex-pattern";
import { SeparatorPattern } from "./separator-pattern";
import { StringPattern } from "./string-pattern";
import { VariablePattern } from "./variable-pattern";
import { CodeInputStream } from '../../../your-parser/code-input-stream';

export class ParserPattern extends Pattern {
    static parsers = [
        StringPattern.parse,
        RegexPattern.parse,
        VariablePattern.parse,
        FunctionPattern.parse,
        ConcludePattern.parse,
        ChoicePattern.parse,
        DelimiterPattern.parse,
    ];

    // TODO: fill
    constructor(public patterns: Pattern[]) {
        super();
    }

    static parsePattern(stream: LanguageInputStream) {
        const namings = Namings.parse(stream);
        for (const parser of this.parsers) {
            const pattern = parser(stream);
            if (pattern) {
                pattern.setNamings(namings);
                return pattern;
            }
        }
        return null;
    }

    static parse(stream: LanguageInputStream) {
        const patterns: Pattern[] = [];
        let first = true;
        while (true) {
            // separation
            const separator = SeparatorPattern.parse(stream);
            if (!separator) {

                // delimiter
                const delimiter = DelimiterPattern.parse(stream);
                if (delimiter) {
                    patterns.push(delimiter);
                } else {

                    // both, separator and delimiter not set
                    if (!first) {
                        stream.croak(`please separate your patterns`);
                    }                
                }

            } else {
                patterns.push(separator);
            }

            const namings = Namings.parse(stream);
            const pattern = this.parsePattern(stream);
            if (!pattern) {
                break;
            }
            pattern.setNamings(namings);
            patterns.push(pattern);

            first = false;
        }
        return new ParserPattern(patterns);
    }

    _parse(stream: CodeInputStream) {
        this.patterns.forEach((pattern, i) => {
            // set the next pattern
            const nextPattern = this.patterns[i + 1];
            stream.setNextPattern(nextPattern);
        })
        return this.patterns.reduce((acc, pattern) => {
            const result = pattern.parse(stream);
            return {
                ...acc,
                ...result
            };
        }, {});
    }
}