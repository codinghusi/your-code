import { InputStream } from "../input-stream";
import { CommentToken } from "./comment-token";

export class LanguageInputStream extends InputStream {
    matchWhitespace() {
        let whitespaces = "";
        let whitespace;
        while (true) {
            if (whitespace = super.matchWhitespace()) {
                whitespaces += whitespace;
                console.log(`collecting whitespace ${whitespaces}`);
                continue;
            }
            if (CommentToken.parse(this)) {
                continue;
            }
            break;
        }
        return whitespaces;
    }
    
    next() {
        return super.next();
    }

    matchNextRegex(regex: RegExp, skipWhitespace = true, skip = true) {
        const result = super.matchNextRegex(regex, skipWhitespace, skip);
        return result;
    }

    matchNextString(str: string, skipWhitespace = true, skip = true) {
        const result = super.matchNextString(str, skipWhitespace, skip);
        return result;
    }
}