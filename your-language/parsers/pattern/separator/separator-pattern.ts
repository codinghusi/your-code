import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";

@ResultType("separator")
export class SeparatorPattern extends LanguagePattern {
    constructor(public whitespace: boolean,
                public optional: boolean) {
        super();
    }

    toString() {
        return this.optional ? '~' : '-' +
               this.whitespace ? '>' : ''
    }

    async parse(stream: CodeInputStream) {
        // FIXME: not finished
        if (this.whitespace) {
            return stream.matchWhitespace();
        }
        return;
    }
    
    async checkFirstWorking(stream: CodeInputStream) {
        return !!(await this.parse(stream));
    }
}