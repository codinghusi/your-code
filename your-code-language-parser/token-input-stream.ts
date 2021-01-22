import { InputStream } from "./input-stream";

const whitespace = /[\s\n]/;

type Predicate = (char: string) => boolean;

export interface Token {
    type: string;
    value: string;
}

export interface VariableDeclarationToken extends Token {
    type: 'variable-declaration';
    isConstant: boolean;
}

export interface FunctionDeclarationToken extends Token {
    type: 'function-declaration';
}

export interface StringToken extends Token {
    type: 'string';
    char: string;
}

export class TokenInputStream {
    public peekStack: Token[] = [];

    constructor(protected stream: InputStream) { }

    private readWhile(predicate: Predicate, skipLast = false) {
        let result = '';
        while (!this.stream.eof() && predicate(this.stream.peek())) {
            result += this.stream.peek();
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

    private isWhitespace() {
        return whitespace.test(this.stream.peek());
    }

    private readWhitespace() {
        const value = this.readWhile(char => whitespace.test(char));
        return {
            type: 'whitespace',
            value
        };
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

    private isRegexBegin() {
        const char = this.stream.peek();
        return char === '/';
    }

    private readRegex() {
        this.stream.next();
        // TODO: add modifier support
        const regex = this.readUntil('/', true, '\\');
        return {
            type: 'regex',
            value: new RegExp(regex)
        };
    }

    private readPunctuation() {
        const value = this.stream.matchOneOf([
            '<!=',
            '||', '=>', '<=', '~>', '->',
            '~', '-', '|', '{', '}', '[', ']', '(', ')', ',', ':',
            '#', '@', '$', '!', '>'
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

    private readVariableDeclaration(): VariableDeclarationToken {
        let isConstant = false;
        this.stream.next();
        if (this.stream.matchNext('!')) {
            isConstant = true;
        }
        const name = this.readIdentifierName();
        return {
            type: 'variable-declaration',
            value: name,
            isConstant
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

    private isFunctionDeclaration() {
        return this.stream.matchNext('@', false);
    }

    private readFunctionDeclaration(): FunctionDeclarationToken {
        this.stream.next();
        const name = this.readIdentifierName();
        return {
            type: 'function-declaration',
            value: name
        };
    }


    private _next() {
        // whitespace
        if (this.isWhitespace()) {
            return this.readWhitespace();
        }
        
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

        // regex
        if (this.isRegexBegin()) {
            return this.readRegex();
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
        if (this.isFunctionDeclaration()) {
            return this.readFunctionDeclaration();
        }

        // punctuations
        const punctuation = this.readPunctuation();
        if (punctuation) {
            return punctuation;
        }

        // nothing matched
        this.croak(`unexpected character '${this.stream.peek()}`);

    }

    croak(message: string) {
        this.stream.croak(message);
    }

    peekNext() {
        const token = this._next();
        if (token) {
            this.peekStack.push(token);
            return token;
        }
        return {
            type: 'eof',
            value: 'reached end of line!'
        };
    }

    peek(skipWhitespace = true, fail = true) {
        let token;
        if (this.peekStack.length) {
            token = this.peekStack[0];
        } else {
            token = this.peekNext();
        }
        
        let i = 1;
        while (skipWhitespace && token.type === 'whitespace') {
            if (this.peekStack.length >= i + 1) {
                token = this.peekStack[i++];
            } else {
                token = this.peekNext();
            }
        }

        return token;
    }

    next(skipWhitespace = true, fail = true) {
        // if (fail && this.stream.eof()) {
        //     this.croak('unexpected reached end of file');
        // }
        
        let token = this.peek(false);
        while (skipWhitespace && token.type === 'whitespace') {
            this.peekStack.splice(0, 1);
            token = this.peek(false);
        }
        this.peekStack.splice(0, 1);
        return token;
    }

    eof(skipWhitespace = true) {
        return this.peek(skipWhitespace, false).type === 'eof';
    }
}