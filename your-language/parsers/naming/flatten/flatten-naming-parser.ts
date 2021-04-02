import { LanguageInputStream } from "../../../language-input-stream";
import { ParserType } from "../../parser";
import { NamingParser } from "../naming-parser";
import { FlattenNaming } from "./flatten-naming-result";

@ParserType("flatten-naming")
export class FlattenNamingParser extends NamingParser<FlattenNaming> {
    async parseIntern(stream: LanguageInputStream) {
        const worked = stream.matchNextString('{') && (stream.matchWhitespace(), stream.matchNextString('}'));
        if (!worked) {
            return null;
        }
        return new FlattenNaming();
    }
}