import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";
import { StringPattern } from "../string/string-pattern";

// TODO: add support for more complex parsers (fixed length, PatternParser)

@ResultType("lookback")
export class LookbackMatchingPattern extends LanguagePattern {
    constructor(public parser: StringPattern,
                public negated: boolean) {
        super();
    }

    toString() {
        return `<=${this.parser}>`;
    }

    async parseIntern(stream: CodeInputStream) {
        return await stream.testOut(async () => {
            stream.position -= this.parser.value.length;
            return await this.parser.softParse(stream);
        });
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.parse(stream);
    }

    collectVariablesAndFunctions() {
        return this.parser.collectVariablesAndFunctions();
    }
}