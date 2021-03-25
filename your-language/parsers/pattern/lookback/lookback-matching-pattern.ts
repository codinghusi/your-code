import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { Type } from "../../parser-result";
import { StringPattern } from "../string/string-pattern";

// TODO: add support for more complex parsers (fixed length, PatternParser)

@Type("lookback")
export class LookbackMatchingPattern extends LanguagePattern {
    constructor(public parser: StringPattern,
                public negated: boolean) {
        super();
    }

    parse(stream: CodeInputStream) {
        return stream.testOut(() => {
            stream.position -= this.parser.value.length;
            return this.parser.softParse(stream);
        });
    }

    checkFirstWorking(stream: CodeInputStream): boolean {
        return this.parse(stream);
    }
}