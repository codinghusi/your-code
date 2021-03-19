import { InputStream } from "./input-stream";
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

    delimitedWithWhitespace<T>(start: string, stop: string, separator: string, parser: (stream: this) => T) {
        const list: T[] = [];
        let first = true;
        if (!this.matchNextString(start)) {
            return null;
        }
        
        while (!this.eof()) {
            console.log(JSON.stringify(list));
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