import { CommentToken } from "./tokens/comment-token";
import { RegexPattern } from './tokens/patterns/regex-pattern';

export class Checkpoint {
    constructor(public position: number,
                public line: number,
                public column: number) { }
}

type Predicate = (char: string) => boolean;

export class InputStream {
    checkpoints: Checkpoint[] = [];
    skippedWhitespace = false;

    constructor(public input: string) {
        this.checkpoints.push(new Checkpoint(0, 1, 0));
    }

    get checkpoint() {
        return this.checkpoints[this.checkpoints.length - 1];
    }

    get position() {
        return this.checkpoint.position;
    }

    set position(position: number) {
        this.checkpoint.position = position;
    }

    get line() {
        return this.checkpoint.line;
    }

    set line(line: number) {
        this.checkpoint.line = line;
    }

    get column() {
        return this.checkpoint.column;
    }

    set column(column: number) {
        this.checkpoint.column = column;
    }
    
    pushCheckPoint(checkpoint?: Checkpoint) {
        checkpoint = checkpoint ?? new Checkpoint(this.position, this.line, this.column);
        this.checkpoints.push(checkpoint);
    }

    popCheckPoint() {
        this.checkpoints.pop();
    }

    testOut<T>(parser: (stream: InputStream) => T | null, successfullSkip = true): T {
        this.pushCheckPoint();
        const result = parser(this);
        if (!result || !successfullSkip) {
            this.popCheckPoint();
        }
        return result;
    }

    seek(offset = 1) {
        // go forward
        while (offset > 0) {
            const char = this.peek();
            if (char === '\n') {
                this.line ++;
                this.column = 0;
            } else {
                this.column ++;
            }
            this.position++;
            offset--;
        }

        // go backward (negative offset)
        while (offset < 0) {
            throw new Error("negative seeking currently not implemented");
        }

        return this;
    }

    next() {
        const char = this.peek();
        this.seek(1);
        return char;
    }

    matchWhitespace() {
        return this.matchNextRegex(/\s+/s);
    }

    matchNextString(str: string, skip = true) {
        const length = str.length;
        if (this.input.substr(this.position, length) === str) {
            if (skip) {
                this.seek(length);
            }
            return str;
        }
        return null;
    }

    getRegexParts(regex: RegExp) {
        const flags = regex.flags;
        const raw = regex.toString().slice(1, -(flags.length + 1));
        return {
            raw,
            flags
        }
    }

    matchNextRegex(regex: RegExp, skip = true) {
        // modification to the regex (must begin at start)
        const regexParts = this.getRegexParts(regex);
        regex = new RegExp(`^${regexParts.raw}`, regexParts.flags);
        // extract
        const match = regex.exec(this.input.slice(this.position))?.[0];
        // console.log(regex.toString() + ", on: " + JSON.stringify(this.input.substr(this.position, 10)) + ", match: ", match);
        if (match) {
            const length = match.length;
            if (skip) {
                this.seek(length);
            }
            return match;
        }
        return null;
    }

    readWhile(predicate: Predicate, skipLast = false) {
        let result = '';
        while (!this.eof() && predicate(this.peek())) {
            result += this.peek();
            this.next();
        }
        if (skipLast) {
            this.next();
        }
        return result;
    }

    readUntil(str: string, skipLast = true, escaping?: string) {
        let result = '';
        while (!this.eof()
            && (escaping && this.matchNextString(escaping, false) || !this.matchNextString(str, skipLast))) {
            result += this.next();
        }
        return result;
    }

    matchOneOf(items: string[]) {
        return items.find(punctuation => this.matchNextString(punctuation));
    }

    peek() {
        return this.input.charAt(this.position);
    }

    debugPeekLength(length: number) {
        return JSON.stringify(this.input.substr(this.position, length));
    }

    eof() {
        return this.position >= this.input.length;
    }

    croak(message: string) {
        throw new Error(`${message} (${this.line}:${this.column}), near ${JSON.stringify(this.input.substr(this.position, 10))}`);
    }
}