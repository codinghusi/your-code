import { LanguageInputStream } from "../../../language-input-stream";
import { Tokens } from "../../token/all-token-parsers";
import { NamingParser } from "../naming-parser";
import { KeyNaming } from "./key-naming-result";

export class KeyNamingParser extends NamingParser<KeyNaming> {
    async parseIntern(stream: LanguageInputStream) {
        let key: string;
        const worked = stream.matchNextString('{') &&
            (stream.matchWhitespace(), key = (await Tokens.name(stream))?.name) &&
            (stream.matchWhitespace(), stream.matchNextString('}'));
        if (!worked) {
            return null;
        }
        return new KeyNaming(key);
    }
}
