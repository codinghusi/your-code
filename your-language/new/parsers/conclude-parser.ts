import { LanguageInputStream } from "../../language-input-stream";
import { LanguageParser } from "../parser";
import { ConcludePattern } from "../patterns/conclude-pattern";
import { Parsers } from "./parsers";

export class ConcludeParser extends LanguageParser {
    parseIntern(stream: LanguageInputStream) {
        if (stream.matchNextString('(')) {
            const content = Parsers.chained(stream);
            if (!stream.matchNextString(')')) {
                stream.croak(`missing closing )`);
            }
            return new ConcludePattern(content);
        }
    }
}