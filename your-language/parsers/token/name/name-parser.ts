import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageTokenParser } from "../parser";
import { NameToken } from "./name-token";


export class NameTokenParser extends LanguageTokenParser<NameToken> {
    async parseIntern(stream: LanguageInputStream) {
        const result = stream.matchNextRegex(/[\w]+/i);
        if (!result) {
            return;
        }
        return new NameToken(result);
    }
}