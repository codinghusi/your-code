import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { Pattern } from "./pattern";


export class StringPattern extends Pattern {
    static type = 'string';

    constructor(public value: string,
                public wholeWordsOnly: boolean) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const char = stream.matchOneOf(`"'`.split(""));
        if (char) {
            if (stream.debugPeekLength(3) === `"//'"`) {
                debugger;
            }
            const result = stream.readUntil(char, true, '\\');
            const wholeWordsOnly = char === `'`;
            return new StringPattern(result, wholeWordsOnly);
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