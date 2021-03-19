import { LanguageInputStream } from "../../language-input-stream";
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
import { LookbackMatchingPattern } from './lookback-matching-pattern';

export class ParserPattern extends Pattern {
    static parsers = [
        StringPattern.parse,
        RegexPattern.parse,
        VariablePattern.parse,
        FunctionPattern.parse,
        ConcludePattern.parse,
        ChoicePattern.parse,
        LookbackMatchingPattern.parse
    ];
    
    // TODO: fill
    constructor(public patterns: Pattern[]) {
        super();
    }
    
    static parsePattern(stream: LanguageInputStream) {
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
    
    static parse(stream: LanguageInputStream) {
        const start = stream.position;
        const patterns: Pattern[] = [];
        while (true) {
            // separation
            // let separatorMissing = false;
            const separator = SeparatorPattern.parse(stream);
            if (!separator) {
                
                // delimiter
                const delimiter = DelimiterPattern.parse(stream);
                if (delimiter) {
                    patterns.push(delimiter);
                } else {
                    
                    // both, separator and delimiter not set
                    if (patterns.length) {
                        // separatorMissing = true;
                        // TODO: add 'latest error'. If nothing works, that can be displayed
                        // here: 'you need to separate patterns' (maybe)
                        break;
                    }               
                }
            }
            
            const pattern = this.parsePattern(stream);
            if (!pattern) {
                if (separator) {
                    stream.croak(`trailing separators aren't allowed`);
                }
                break;
            }
            // } else if (separatorMissing) {
            //     console.log(pattern);
            //     stream.croak(`please separate your patterns`);
            // }
            pattern.setSeparator(separator);
            patterns.push(pattern);
        }
        const captured = JSON.stringify(stream.input.slice(start, stream.position));
        console.log("captured: " + captured);
        console.log("patterns: " + JSON.stringify(patterns))
        return new ParserPattern(patterns);
    }

    
    
    parse(stream: CodeInputStream) {
        let results = {};

        this.patterns.forEach((pattern, i) => {
            const separator = pattern.separatorBefore;
            const optional = separator?.optional;
            separator?.parse(stream);
            
            let pushedCheckPoint = false;
            
            try {
                // set the next pattern
                const nextPattern = this.patterns[i + 1];
                stream.tempNextPattern(nextPattern, () => {
                    // check for later, if the optional pattern fits in
                    let previousNextCheck: boolean;
                    if (optional) {
                        previousNextCheck = stream.checkNextPattern();
                        stream.pushCheckPoint();
                        pushedCheckPoint = true;
                    }
                    
                    // parse current pattern
                    const result = pattern.parse(stream);
                    
                    // if optional pattern destroyed flow, discard it
                    if (optional && previousNextCheck && !stream.checkNextPattern()) {
                        stream.popCheckPoint();
                        pushedCheckPoint = false;
                        return;
                    }
                    
                    results = {
                        ...results,
                        ...result
                    };
                });
            } catch(e) {
                if (pushedCheckPoint) {
                    stream.popCheckPoint();
                }
                if (!optional) {
                    throw e;
                }
            }
        });
        
        return results;
    }
    
    checkFirstWorking(stream: CodeInputStream) {
        if (!this.patterns.length) {
            return;
        }
        const pattern = this.patterns[0];
        pattern.separatorBefore?.parse(stream);
        return !!pattern.parse(stream);
    }

}