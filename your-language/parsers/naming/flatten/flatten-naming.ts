import { LanguageInputStream } from "../../../language-input-stream";
import { NamingParser } from "../naming-parser";
import { FlattenNaming } from "./flatten-naming copy";

export class FlattenNamingParser extends NamingParser<FlattenNaming> {
    async parseIntern(stream: LanguageInputStream) {
        const worked = stream.matchNextString('{') && (stream.matchWhitespace(), stream.matchNextString('}'));
        if (!worked) {
            return null;
        }
        return new FlattenNaming();
    }

    onToResult(result: any) {
        return result;
    }
}