import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { Type } from "../../parser-result";
import { PatternChainPattern } from "../chained/pattern-chain-pattern";

@Type("delimiter")
export class DelimiterPattern extends LanguagePattern {
    constructor(public value: PatternChainPattern,
                public separator?: PatternChainPattern) {
        super();
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