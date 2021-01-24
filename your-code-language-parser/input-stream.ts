
class Checkpoint {
    constructor(public position: number,
                public line: number,
                public column: number) { }
}

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

    matchNextString(str: string, skip = true) {
        const length = str.length;
        if (this.input.substr(this.position, length) === str) {
            if (skip) {
                this.skip(length);
            }
            return true;
        }
        return false;
    }

    matchNextRegex(regex: RegExp, skip = true) {
        const [match] = this.input.slice(this.position).match(regex);
        if (match) {
            const length = match.length;
            if (skip) {
                this.skip(length);
            }
            return match;
        }
        return null;
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