import { InputStream } from "./input-stream";

const whitespace = /[\s\n]/;





export class TokenInputStream {
    public peekStack: Token[] = [];

    constructor(protected stream: InputStream) { }

    // -- punctuation

    // private readPunctuation() {
    //     const value = this.stream.matchOneOf([
    //         '<!=',
    //         '||', '=>', '<=', '~>', '->',
    //         '~', '-', '|', '{', '}', '[', ']', '(', ')', ',', ':',
    //         '#', '@', '$', '!', '>'
    //     ]);
    //     if (value) {
    //         return {
    //             type: 'punctuation',
    //             value
    //         }
    //     }
    //     return null;
    // }

    
    // -- function declaration

    private isFunctionDeclaration() {
        return this.stream.matchNextString('@', false);
    }

    private readFunctionDeclaration(): FunctionDeclarationToken {
        this.stream.next();
        const name = this.readIdentifierName();
        return {
            type: 'function-declaration',
            value: name
        };
    }


    // -- core

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
        if (this.stream.matchNextString('//')) {
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

    
    // -- utils

    croak(message: string) {
        this.stream.croak(message);
    }

    protected peekNext() {
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