import { ConcludePattern } from "../patterns/conclude-pattern";
import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../parser";
import { Patterns } from "./parsers";

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