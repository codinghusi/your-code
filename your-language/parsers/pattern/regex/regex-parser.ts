import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../../language-parser";
import { RegexPattern } from "./regex-pattern";
import { ParserType } from "../../parser";

@ParserType("regex")
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