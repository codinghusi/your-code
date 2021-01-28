import { InputStream } from "../input-stream";
import { CommentToken } from "./comment-token";

type Parser = { parse: (stream: LanguageInputStream) => any };

export class LanguageInputStream extends InputStream {
    lookbackParsers: Parser[] = [];
    lookbackWorked = false;

    // nextPatterns ...
    // put lookback parser to CodeInputStream
    // make lookback things into smth like testOut(...)

    resetLookbackParser() {
        this.lookbackParsers = [];
        return this;
    }

    addLookbackParser(parser: Parser) {
        this.lookbackParsers.push(parser);
    }

    parseLookbacks() {
        this.lookbackWorked = this.testOut(() => {
            for (const parser of this.lookbackParsers) {
                if (!parser.parse(this)) {
                    return false;
                }
            }
            return true;
        });
        return this.lookbackWorked;
    }

    doesLookbackWork() {
        return this.lookbackWorked;
    }

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