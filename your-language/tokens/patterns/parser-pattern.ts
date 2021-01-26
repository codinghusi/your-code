import { LanguageInputStream } from "../language-input-stream";
import { ChoicePattern } from "./choice-pattern";
import { ConcludePattern } from "./conclude-pattern";
import { DelimiterPattern } from "./delimiter-pattern";
import { FunctionPattern } from "./function-pattern";
import { Namings } from "./naming";
import { Pattern } from "./pattern";
import { RegexPattern } from "./regex-pattern";
import { SeparatorPattern } from "./separator-pattern";
import { StringPattern } from "./string-pattern";
import { VariablePattern } from "./variable-pattern";

export class ParserPattern extends Pattern {
    static parsers = [
        StringPattern.parse,
        RegexPattern.parse,
        SeparatorPattern.parse,
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
        while (true) {
            const namings = Namings.parse(stream);
            const pattern = this.parsePattern(stream);
            if (!pattern) {
                break;
            }
            pattern.setNamings(namings);
            patterns.push(pattern)
        }
        return new ParserPattern(patterns);
    }
}