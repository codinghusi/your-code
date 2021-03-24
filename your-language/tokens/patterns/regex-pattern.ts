import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { TokenCapture } from "../../token-capture";
import { Pattern } from "./pattern";


export class RegexPattern extends Pattern {
    constructor(capture: TokenCapture,
                public regex: RegExp) {
        super(capture);
    }
    
    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        if (stream.matchNextString('/')) {
            const result = stream.readUntil('/', true, '\\');
            const regex = new RegExp(result);
            return new RegexPattern(capture.finish(), regex);
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