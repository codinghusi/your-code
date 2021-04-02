import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";

@ResultType("chained")
export class PatternChainPattern extends LanguagePattern {
    constructor(public patterns: LanguagePattern[]) {
        super();
    }
    
    toString() {
        let result = " ";
        this.patterns.forEach(pattern => {
            if (pattern.separatorBefore) {
                result += " " + pattern.separatorBefore.toString() + " ";
            }
            const namings = pattern.getNamings() ? pattern.getNamings() + " " : "";
            result += `${namings}${pattern}`;
        });
        return result;
    }

    async parseIntern(stream: CodeInputStream) {
        let results = {};

        let i = 0;
        for (const pattern of this.patterns) {
            const separator = pattern.separatorBefore;
            const optional = separator?.optional;
            await separator?.parse(stream);
            
            let pushedCheckPoint = false;
            
            try {
                // set the next pattern
                const nextPattern = this.patterns[++i];
                await stream.tempNextPattern(nextPattern, async () => {
                    // check for later, if the optional pattern fits in
                    let previousNextCheck: boolean;
                    if (optional) {
                        previousNextCheck = await stream.checkNextPattern();
                        stream.pushCheckpoint();
                        pushedCheckPoint = true;
                    }
                    
                    // parse current pattern
                    const result = await pattern.parse(stream);
                    
                    // if optional pattern destroyed flow, discard it
                    if (optional && previousNextCheck && !(await stream.checkNextPattern())) {
                        stream.popCheckpoint();
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
                    stream.popCheckpoint();
                }
                if (!optional) {
                    throw e;
                }
            }
        }
        
        return results;
    }
    
    async checkFirstWorking(stream: CodeInputStream) {
        const pattern = this.patterns[0];
        await pattern.separatorBefore?.parse(stream);
        return !!(await pattern.parse(stream));
    }

    collectVariablesAndFunctions() {
        return [].concat(...this.patterns.map(pattern => pattern.collectVariablesAndFunctions()));
    }

}