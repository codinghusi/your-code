import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageTokenParser } from "../parser";
import { CommentToken } from "../tokens/comment-token";

export class CommentTokenParser extends LanguageTokenParser<CommentToken> {
    async parseIntern(stream: LanguageInputStream) {
        const result = stream.matchComment();
        if (!result) {
            return;
        }
        return new CommentToken(result);
    }
}