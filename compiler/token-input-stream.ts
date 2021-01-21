import { InputStream } from "./input-stream";

type Predicate = (char: string) => boolean;

export class TokenInputStream {
    constructor(protected stream: InputStream) { }

    private readWhile(predicate: Predicate, skipLast = false) {
        let result = '';
        let char;
        while (!this.stream.eof() && predicate(char = this.stream.peek())) {
            result += char;
            this.stream.next();
        }
        if (skipLast) {
            this.stream.next();
        }
        return result;
    }

    private readUntil(str: string, skipLast = true) {
        let result = '';
        while (!this.stream.eof() && !this.stream.hasNext(str, skipLast)) {
            result += this.stream.next();
        }
        return result;
    }

    private skipWhitespace() {
        const whitespace = /[\s\n]/;
        this.readWhile(whitespace.test);
    }

    private skipComment() {
        this.readWhile(char => char !== '\n', true);
    }

    private isString() {
        const char = this.stream.peek();
        return char === '"' || char === "'";
    }

    private readString() {
        const char = this.stream.next()
        const value = this.readUntil(char);
        return {
            type: 'string',
            value,
            char
        };
    }

    private isPunctuation() {
        return [ '||', '=>', '<=', '~>', '->', '~', '-', '|', '{', '}', '[', ']', '(', ')', ',', ':' ]
    }


    next() {
        this.skipWhitespace();
        
        // check file end
        if (this.stream.eof()) {
            return null;
        }

        // single line comment
        if (this.stream.hasNext('//')) {
            this.skipComment();
            return this.next();
        }

        // string
        if (this.isString()) {
            return this.readString();
        }

        // punctuations


    }
}