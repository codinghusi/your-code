import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { PatternType } from "../../parser-result";

@PatternType("chained")
export class PatternChainPattern extends LanguagePattern {
    constructor(public patterns: LanguagePattern[]) {
        super();
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
                        stream.pushCheckpoint();
                        pushedCheckPoint = true;
                    }
                    
                    // parse current pattern
                    const result = pattern.parse(stream);
                    
                    // if optional pattern destroyed flow, discard it
                    if (optional && previousNextCheck && !stream.checkNextPattern()) {
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