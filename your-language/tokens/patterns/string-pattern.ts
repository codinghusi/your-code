import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { TokenCapture } from "../../token-capture";
import { Pattern } from "./pattern";


export class StringPattern extends Pattern {
    static type = 'string';

    constructor(capture: TokenCapture,
                public value: string,
                public wholeWordsOnly: boolean) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const char = stream.matchOneOf(`"'`.split(""));
        if (char) {
            if (stream.debugPeekLength(3) === `"//'"`) {
                debugger;
            }
            const result = stream.readUntil(char, true, '\\');
            const wholeWordsOnly = char === `'`;
            return new StringPattern(capture.finish(), result, wholeWordsOnly);
        }
        return null;
    }

    parse(stream: CodeInputStream) {
        const raw = stream.matchNextString(this.value);
        return this.namings.onToResult(raw); 
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return !!this.parse(stream);
    }
}