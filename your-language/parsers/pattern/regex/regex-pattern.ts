import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";

@ResultType("regex")
export class RegexPattern extends LanguagePattern {
    constructor(public regex: RegExp) {
        super();
    }

    toString() {
        return `${this.regex}`;
    }

    async parseIntern(stream: CodeInputStream) {
        // TODO: throw an error on fail
        return stream.matchNextRegex(this.regex);
    }
    
    async checkFirstWorking(stream: CodeInputStream) {
        return !!(await this.parse(stream));
    }

    collectVariablesAndFunctions() {
        return [];
    }
}