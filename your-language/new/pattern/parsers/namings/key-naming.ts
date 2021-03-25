import { KeyNaming } from "../../result/namings/key-naming";
import { LanguageInputStream } from "../../../../language-input-stream";
import { NamingParser } from "./naming-parser";
import { Tokens } from "../../../token/parsers/token-parsers";

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
