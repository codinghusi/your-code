import { InputStream } from "./input-stream";
import { TokenCapture } from "./token-capture";
import { CommentToken } from "./tokens/comment-token";

export class LanguageInputStream extends InputStream {

    hasWhitespace() {
        return this.testOut(() => {
            return !!this.matchWhitespace();
        }, false);
    }

    matchWhitespace() {
        // well this one is kind of a duplicate to WhitespaceToken.parse
        let whitespaces = "";
        let whitespace: string;
        while (true) {
            if (whitespace = super.matchWhitespace()) {
                whitespaces += whitespace;
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

    matchNextRegex(regex: RegExp, skip = true) {
        let result = null;
        this.testOut(() => {
            result = super.matchNextRegex(regex, skip);
            if (skip && result) {
                return true;
            }
        });
        return result;
    }

    matchNextString(str: string, skip = true) {
        let result = null;
        this.testOut(() => {
            result = super.matchNextString(str, skip);
            if (skip && result) {
                return true;
            }
        });
        return result;
    }

    croakWithTokenCapture(message: string, tokenCapture: TokenCapture) {
        this.croak(message, tokenCapture.start.line, tokenCapture.start.column, tokenCapture.capture);
    }

    delimitedWithWhitespace<T>(start: string, stop: string, separator: string, parser: (stream: this) => T) {
        const list: T[] = [];
        let first = true;
        if (!this.matchNextString(start)) {
            return null;
        }
        
        while (!this.eof()) {
            this.matchWhitespace();
            if (this.matchNextString(stop)) {
                break;
            }
            if (first) {
                first = false;
            } else {
                this.matchWhitespace();
                if (!this.matchNextString(separator)) {
                    this.croak(`you need to delimit your values with ${separator}`);
                }
            }

            this.matchWhitespace();
            if (this.matchNextString(stop)) {
                break;
            }
            
            const result = parser(this);
            if (!result) {
                this.matchWhitespace();
                if (!this.matchNextString(stop)) {
                    this.croak(`missing unclosed ${stop}`);
                }
                break;
            }
            list.push(result);
        }
        return list;
    }
}
