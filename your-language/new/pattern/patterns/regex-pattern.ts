import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../pattern";

export class RegexPattern extends LanguagePattern {
    constructor(public regex: RegExp) {
        super();
    }

    parse(stream: CodeInputStream) {
        const raw = stream.matchNextRegex(this.regex);
        return this.namings.onToResult(raw); 
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return !!this.parse(stream);
    }
}