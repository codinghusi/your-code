import { InputStream } from "../input-stream";
import { CommentToken } from "./comment-token";

export class LanguageInputStream extends InputStream {
   

    skipComments(enabled = true) {
        if (enabled) {
            while (CommentToken.parse(this));
        }
    }
    
    next(skipComments = true) {
        this.skipComments(skipComments);
        return super.next();
    }

    matchNextRegex(regex: RegExp, skipWhitespace = true, skip = true, skipComments = true) {
        this.skipComments(skipComments);
        return super.matchNextRegex(regex, skipWhitespace, skip);
    }

    matchNextString(str: string, skipWhitespace = true, skip = true, skipComments = true) {
        this.skipComments(skipComments);
        return super.matchNextString(str, skipWhitespace, skip);
    }
}