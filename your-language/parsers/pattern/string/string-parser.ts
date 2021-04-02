import { StringPattern } from './string-pattern';
import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../../language-parser";
import { ParserType } from "../../parser";

@ParserType("string")
export class StringParser extends LanguageParser<StringPattern> {
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