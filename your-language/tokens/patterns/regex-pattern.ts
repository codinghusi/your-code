import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { Pattern } from "./pattern";


export class RegexPattern extends Pattern {
    constructor(public regex: RegExp) {
        super();
    }
    
    static parse(stream: LanguageInputStream) {
        if (stream.matchNextString('/')) {
            const result = stream.readUntil('/', true, '\\');
            const regex = new RegExp(result);
            return new RegexPattern(regex);
        }
        return null;
    }

    parse(stream: CodeInputStream) {
        const raw = stream.matchNextRegex(this.regex);
        return this.namings.onToResult(raw); 
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return !!this.parse(stream);
    }
}