import { InputStream } from "./input-stream";
import { CommentToken } from "./tokens/comment-token";

export class LanguageInputStream extends InputStream {

    hasWhitespace() {
        return this.testOut(() => {
            return !!this.matchWhitespace();
        }, false);
    }

    matchWhitespace() {
        let whitespaces = "";
        let whitespace;
        while (true) {
            if (whitespace = this.matchNextRegex(/[\s]+/s, false)) {
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

    matchNextRegex(regex: RegExp, skipWhitespace = true, skip = true) {
        let result = null;
        this.testOut(() => {
            if (skipWhitespace) {
                this.matchWhitespace();
            }
            result = super.matchNextRegex(regex, skip);
            if (skip && result) {
                return true;
            }
        });
        return result;
    }

    matchNextString(str: string, skipWhitespace = true, skip = true) {
        let result = null;
        this.testOut(() => {
            if (skipWhitespace) {
                this.matchWhitespace();
            }
            result = super.matchNextString(str, skip);
            if (skip && result) {
                return true;
            }
        });
        return result;
    }

    delimitedWithWhitespace<T>(start: string, stop: string, separator: string, parser: (stream: this) => T) {
        const list: T[] = [];
        let first = true;
        if (!this.matchNextString(start)) {
            return null;
        }

        while (!this.eof()) {
            if (this.matchNextString(stop)) {
                break;
            }
            if (first) {
                first = false;
            } else {
                if (!this.matchNextString(separator)) {
                    this.croak(`you need to delimit your values with ${separator}`);
                }
            }
            if (this.matchNextString(stop)) {
                break;
            }

            this.matchWhitespace();

            const result = parser(this);
            if (!result) {
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