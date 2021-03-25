import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../parser";
import { RegexPattern } from "../patterns/regex-pattern";

export class RegexParser extends LanguageParser<RegexPattern> {
    async parseIntern(stream: LanguageInputStream) {
        if (stream.matchNextString('/')) {
            const result = stream.readUntil('/', true, '\\');
            const regex = new RegExp(result);
            return new RegexPattern(regex);
        }
        return null;
    }
}