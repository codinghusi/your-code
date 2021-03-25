import { LanguageInputStream } from "../../../language-input-stream";
import { Patterns } from "../../pattern/all-patterns";
import { Tokens } from "../../token/all-token-parsers";
import { NamingParser } from "../naming-parser";
import { KeyValueNaming } from "./key-value-naming-result";

// example: {mykey: 'myvalue'}
export class KeyValueNamingParser extends NamingParser<KeyValueNaming> {
    async parseIntern(stream: LanguageInputStream) {
        let key: string, value: string;
        const worked = stream.matchNextString('{') &&
            (stream.matchWhitespace(), key = (await Tokens.name(stream))?.name) &&
            (stream.matchWhitespace(), stream.matchNextString(':')) &&
            (stream.matchWhitespace(), value = (await Patterns.string(stream))?.value) &&
            stream.matchNextString('}');
        if (!worked) {
            return null;
        }
        return new KeyValueNaming(key, value);
    }
    
}
