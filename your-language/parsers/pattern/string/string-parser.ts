import { StringPattern } from './string-pattern';
import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../../language-parser";
import { ParserType } from "../../parser";
import { EOL } from 'os';

const specialCharMapping = {
    'n': EOL,
    't': '\t',
    '\\': '\\',
}

@ParserType("string")
export class StringParser extends LanguageParser<StringPattern> {
    async parseIntern(stream: LanguageInputStream) {
        const char = stream.matchOneOf(`"'`.split(""));
        if (char) {
            const result = stream.readUntil(char, true, '\\');
            const withSpecialCharacters = result.replace(/\\(.)/g, (match, char) => {
                const mapping = specialCharMapping[char];
                if (mapping) {
                    return mapping;
                }
                return char;
            })
            const wholeWordsOnly = char === `'`;
            return new StringPattern(withSpecialCharacters, wholeWordsOnly);
        }
        return null;
    }
}