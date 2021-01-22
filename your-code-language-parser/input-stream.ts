

export class InputStream {
    protected position = 0;
    protected line = 1;
    protected column = 0;

    constructor(public input: string) { }

    next() {
        const char = this.input.charAt(this.position++);
        if (char === '\n') {
            this.line ++;
            this.column = 0;
        } else {
            this.column ++;
        }
        return char;
    }

    matchNext(str: string, skip = true) {
        const length = str.length;
        if (this.input.substr(this.position, length) === str) {
            if (skip) {
                for (let i = 0; i < length; ++i) {
                    this.next();
                }
            }
            return true;
        }
        return false;
    }

    matchOneOf(items: string[]) {
        return items.find(punctuation => this.matchNext(punctuation));
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