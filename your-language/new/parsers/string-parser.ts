import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { TokenCapture } from "../../token-capture";
import { LanguageParser } from "../parser";
import { StringPattern } from "../patterns/string-pattern";


export class StringParser extends LanguageParser {
    type = 'string';

    parseIntern(stream: LanguageInputStream) {
        const char = stream.matchOneOf(`"'`.split(""));
        if (char) {
            const result = stream.readUntil(char, true, '\\');
            const wholeWordsOnly = char === `'`;
            return new StringPattern(result, wholeWordsOnly);
        }
        return null;
    }
}