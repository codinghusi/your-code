import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";

@ResultType("string")
export class StringPattern extends LanguagePattern {
    constructor(public value: string,
                public wholeWordsOnly: boolean) {
        super();
    }

    toString() {
        let char = '"'
        if (this.wholeWordsOnly) {
            char = "'";
        }
        return `${char}${this.value}${char}`;
    }

    async parseIntern(stream: CodeInputStream) {
        // FIXME: wholeWordsOnly is ignored!
        // TODO: throw an error on fail
        return stream.matchNextString(this.value);
    }
    
    async checkFirstWorking(stream: CodeInputStream) {
        return !!(await this.parse(stream));
    }

    collectVariablesAndFunctions() {
        return [];
    }
}