import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageTokenParser } from "../parser";
import { WhitespaceToken } from "./whitespace-token";

export class WhitespaceTokenParser extends LanguageTokenParser<WhitespaceToken> {
    async parseIntern(stream: LanguageInputStream) {
        const result = stream.matchWhitespace();
        if (!result) {
            return null;
        }
        return new WhitespaceToken(result);
    }
}
