import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../parser";
import { StringPattern } from "../patterns/string-pattern";

export class StringParser extends LanguageParser<StringPattern> {
    type = 'string';

    async parseIntern(stream: LanguageInputStream) {
        const char = stream.matchOneOf(`"'`.split(""));
        if (char) {
            const result = stream.readUntil(char, true, '\\');
            const wholeWordsOnly = char === `'`;
            return new StringPattern(result, wholeWordsOnly);
        }
        return null;
    }
}