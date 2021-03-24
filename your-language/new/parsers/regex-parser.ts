import { LanguageInputStream } from "../../language-input-stream";
import { LanguageParser } from "../parser";


export class RegexParser extends LanguageParser {
    parseIntern(stream: LanguageInputStream) {
        if (stream.matchNextString('/')) {
            const result = stream.readUntil('/', true, '\\');
            const regex = new RegExp(result);
            return new RegexPattern(regex);
        }
        return null;
    }
}