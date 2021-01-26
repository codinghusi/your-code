
class Checkpoint {
    constructor(public position: number,
                public line: number,
                public column: number) { }
}

type Predicate = (char: string) => boolean;

export class InputStream {
    checkpoints: Checkpoint[] = [];

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
    
    pushCheckPoint() {
        this.checkpoints.push(new Checkpoint(this.position, this.line, this.column));
    }

    popCheckPoint() {
        this.checkpoints.pop();
    }

    testOut<T>(parser: (stream: InputStream) => T | null): T {
        this.pushCheckPoint();
        const result = parser(this);
        if (!result) {
            this.popCheckPoint();
        }
        return result;
    }

    next() {
        const char = this.input.charAt(this.position++);
        this.skip(1);
        return char;
    }

    skip(count = 1) {
        for (let i = 0; i < count; ++i) {
            const char = this.input.charAt(this.position++)
            if (char === '\n') {
                this.line ++;
                this.column = 0;
            } else {
                this.column ++;
            }
        }
    }

    matchWhitespace() {
        return this.matchNextRegex(/[\s\n]+/, false);
    }

    matchNextString(str: string, skipWhitespace = true, skip = true) {
        if (skipWhitespace) {
            this.pushCheckPoint();
            this.matchWhitespace();
        }

        const length = str.length;
        if (this.input.substr(this.position, length) === str) {
            if (skip) {
                this.skip(length);
            }
            return str;
        }

        if (skipWhitespace) {
            this.popCheckPoint();
        }
        return null;
    }

    matchNextRegex(regex: RegExp, skipWhitespace = true, skip = true) {
        if (skipWhitespace) {
            this.pushCheckPoint();
            this.matchWhitespace();
        }

        const [match] = regex.exec(this.input.slice(this.position));
        if (match) {
            const length = match.length;
            // check if was from start
            if (this.input.substr(this.position, length) === match) {
                if (skip) {
                    this.skip(length);
                }
                return match;
            }
        }

        if (skipWhitespace) {
            this.popCheckPoint();
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

    matchOneOf(items: string[]) {
        return items.find(punctuation => this.matchNextString(punctuation));
    }

    peek() {
        return this.input.charAt(this.position);
    }

    eof() {
        return this.peek() === '';
    }

    croak(message: string) {
        throw new Error(`${message} (${this.line}:${this.column})`);
    }
}