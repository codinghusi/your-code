import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../../language-parser";
import { Patterns } from "../all-patterns";
import { ConcludePattern } from "./conclude-pattern";
import { ParserType } from "../../parser";

@ParserType("conclude")
export class ConcludeParser extends LanguageParser<ConcludePattern> {
    async parseIntern(stream: LanguageInputStream) {
        if (stream.matchNextString('(')) {
            const content = await Patterns.chained(stream);
            if (!stream.matchNextString(')')) {
                stream.croak(`missing closing )`);
            }
            return new ConcludePattern(content);
        }
    }
}