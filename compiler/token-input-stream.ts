import { InputStream } from "./input-stream";

type Predicate = (char: string) => boolean;

interface Token {
    type: string;
    value: string | number;
}

export class TokenInputStream {
    public current: Token;

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

    private readUntil(str: string, skipLast = true, escaping?: string) {
        let result = '';
        while (!this.stream.eof()
            && (escaping && this.stream.matchNext(escaping, false) || !this.stream.matchNext(str, skipLast))) {
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
        const value = this.readUntil(char, true, '\\');
        return {
            type: 'string',
            value,
            char
        };
    }

    private readPunctuation() {
        const value = this.stream.matchOneOf([
            '<!=',
            '||', '=>', '<=', '~>', '->',
            '~', '-', '|', '{', '}', '[', ']', '(', ')', ',', ':',
            '#', '@', '$'
        ]);
        if (value) {
            return {
                type: 'punctuation',
                value
            }
        }
        return null;
    }

    private isIdentifierBeginning() {
        return /[_a-z]/i.test(this.stream.peek());
    }

    private readIdentifierName() {
        return this.readWhile(char => /[_\w]/.test(char));
    }

    private readIdentifier() {
        const name = this.readIdentifierName();
        return {
            type: 'identifier',
            value: name
        }
    }

    private isVariableDeclaration() {
        return this.stream.matchNext('#', false);
    }

    private readVariableDeclaration() {
        let isConst = false;
        this.stream.next();
        if (this.stream.matchNext('!')) {
            isConst = true;
        }
        const name = this.readIdentifierName();
        return {
            type: 'variable-declaration',
            value: name,
            isConst
        };
    }

    private isVariable() {
        return this.stream.matchNext('$', false);
    }

    private readVariable() {
        this.stream.next();
        const name = this.readIdentifierName();
        return {
            type: 'variable',
            value: name
        };
    }

    private isFunction() {
        return this.stream.matchNext('@', false);
    }

    private readFunction() {
        this.stream.next();
        const name = this.readIdentifierName();
        return {
            type: 'variable',
            value: name
        };
    }


    _next() {
        this.skipWhitespace();
        
        // check file end
        if (this.stream.eof()) {
            return null;
        }

        // single line comment
        if (this.stream.matchNext('//')) {
            this.skipComment();
            return this._next();
        }

        // string
        if (this.isString()) {
            return this.readString();
        }

        // punctuations
        const punctuation = this.readPunctuation();
        if (punctuation) {
            return punctuation;
        }

        // identifier
        if (this.isIdentifierBeginning()) {
            return this.readIdentifier();
        }

        // variable declaration
        if (this.isVariableDeclaration()) {
            return this.readVariableDeclaration();
        }

        // variable
        if (this.isVariable()) {
            return this.readVariable();
        }

        // function
        if (this.isFunction()) {
            return this.readFunction();
        }

        // nothing matched
        this.croak(`unexpected character '${this.stream.peek()}`);

    }

    croak(message: string) {
        this.stream.croak(message);
    }

    peek() {
        return this.current ?? (this.current = this._next());
    }

    next() {
        const token = this.current;
        this.current = null;
        return token ?? this._next();
    }

    eof() {
        return this.peek() === null;
    }
}