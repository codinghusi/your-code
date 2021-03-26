import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { PatternType } from "../../parser-result";

@PatternType("string")
export class StringPattern extends LanguagePattern {
    constructor(public value: string,
                public wholeWordsOnly: boolean) {
        super();
    }

    parse(stream: CodeInputStream) {
        const raw = stream.matchNextString(this.value);
        return this.namings.onToResult(raw); 
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return !!this.parse(stream);
    }
}