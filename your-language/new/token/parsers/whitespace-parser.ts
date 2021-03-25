import { LanguageInputStream } from "../../../language-input-stream";
import { WhitespaceToken } from "../tokens/whitespace-token";
import { LanguageTokenParser } from "../parser";

export class WhitespaceTokenParser extends LanguageTokenParser<WhitespaceToken> {
    async parseIntern(stream: LanguageInputStream) {
        const result = stream.matchWhitespace();
        if (!result) {
            return null;
        }
        return new WhitespaceToken(result);
    }
}
