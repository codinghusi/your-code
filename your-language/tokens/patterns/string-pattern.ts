import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { Pattern } from "./pattern";

interface Params {
    value: string;
    wholeWordsOnly: boolean;
}

export class StringPattern extends Pattern {
    static type = "string";

    value: string;
    wholeWordsOnly: boolean;
    
    constructor(params: Params) {
        super();
        Object.assign(this, params);
    }

    static parse(stream: LanguageInputStream) {
        const char = stream.matchOneOf(`"'`.split(""));
        if (char) {
            const value = stream.readUntil(char, true, '\\');
            const wholeWordsOnly = char === `'`;
            return new StringPattern({ value, wholeWordsOnly });
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