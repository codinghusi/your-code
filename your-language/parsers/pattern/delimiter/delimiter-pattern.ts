import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";
import { PatternChainPattern } from "../chained/pattern-chain-pattern";

@ResultType("delimiter")
export class DelimiterPattern extends LanguagePattern {
    constructor(public value: PatternChainPattern,
                public separator?: PatternChainPattern) {
        super();
    }

    toString() {
        let result = `=> `;
        result += this.value.toString();
        if (this.separator) {
            result += " | " + this.separator.toString();
        }
        result += " <=";
        return result;
    }

    async parseIntern(stream: CodeInputStream) {
        const values = [];
        let first = true;

        await stream.tempNextPattern(this.separator, async () => {
            
            // collect values
            while (true) {

                // separator
                if (this.separator) {
                    // TODO: maybe add an error
                    const separator = await this.separator.softParse(stream);
                    if (!separator && !first) {
                        break;
                    }
                    first = false;
                }
                
                // value
                const value = await this.value.softParse(stream);
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

    async checkFirstWorking(stream: CodeInputStream) {
        return !!(await this.value.softParse(stream));
    }

    collectVariablesAndFunctions() {
        return [
            ...this.value.collectVariablesAndFunctions(),
            ...(this.separator?.collectVariablesAndFunctions() ?? [])
        ]
    }
}