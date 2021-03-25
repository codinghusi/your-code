import { LanguageInputStream } from "../../../language-input-stream";
import { TokenCapture } from "../../../token-capture";
import { Token } from "../../../tokens/token";
import { NameToken } from "../tokens/name-token";
import { LanguageTokenParser } from "../parser";


export class NameTokenParser extends LanguageTokenParser<NameToken> {
    async parseIntern(stream: LanguageInputStream) {
        const result = stream.matchNextRegex(/[\w]+/i);
        if (!result) {
            return;
        }
        return new NameToken(result);
    }
}