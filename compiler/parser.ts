import { FunctionDeclarationToken, StringToken, Token, TokenInputStream, VariableDeclarationToken } from "./token-input-stream";

interface Item {
    type: string;
}

interface VariableDeclarationItem extends Item {
    name: string;
    isConstant: boolean;
    patterns: PatternItem[];
}

interface FunctionDeclarationItem extends Item {
    name: string;
    patterns: PatternItem[];
    variables: VariableDeclarationItem[];
}

interface PatternItem extends Item {
    type: 'pattern';
    patternType: string;
}

type ParserThing = () => Item | any;

export class Parser {
    constructor(protected stream: TokenInputStream) {

    }

    is(type: string, value: string) {
        const token = this.stream.peek();
        if (token.type === type && token.value === value) {
            return true;
        }
        return false;
    }

    isType(type: string) {
        const token = this.stream.peek();
        if (token.type === type) {
            return true;
        }
        return false;
    }

    skip(type: string, value: string) {
        const token = this.stream.next();
        if (token.type !== type || token.value !== value) {
            this.croak(`expected ${type} '${value}', but got ${token.type} '${token.value}'`);
        }
        return token;
    }

    skipType(type: string) {
        const token = this.stream.next();
        if (token.type !== type) {
            this.croak(`expected ${type}, but got ${token.type} '${token.value}'`);
        }
        return token;
    }

    delimited(start: string, stop: string, separator: string, parser: ParserThing) {
        const list = [];
        let first = true;
        this.skip('punctuation', start);

        while (!this.stream.eof()) {
            if (this.is('punctuation', stop)) {
                break;
            }
            if (first) {
                first = false;
            } else {
                this.skip('punctuation', separator);
            }
            if (this.is('punctuation', stop)) {
                break;
            }
            const result = parser.call(this);
            if (!result) {
                break;
            }
            list.push(result);
        }
        this.skip('punctuation', stop);
        return list;
    }

    parse() {
        const definitions: Item[] = [];
        while (!this.stream.eof()) {
            let definition: Item;
            if (this.isType('variable-declaration')) {
                definition = this.parseVariableDeclaration();
            }
            else if (this.isType('function-declaration')) {
                definition = this.parseFunctionDeclaration();
            }
            else if (this.is('punctuation', '!')) {
                definition = this.parseDefinition();
            }
            else {
                const token = this.stream.peek();
                this.croak(`unexpected ${token.type} '${token.value}'`);
            }
            definitions.push(definition);
        }
        return definitions;
    }

    parseVariableDeclaration(): VariableDeclarationItem {
        const variableStart = this.stream.next() as VariableDeclarationToken;
        const { value: name, isConstant } = variableStart;
        const patterns = this.maybeParsePatterns();
        return {
            type: 'variable-declaration',
            name,
            isConstant,
            patterns
        }
    }

    isIdented() {
        const whitespace = this.stream.peek(false);
        if (whitespace.type === 'whitespace'
        &&  whitespace.value.charAt(-1) !== '\n') {
            return true;
        }
        return false;
    }

    parseFunctionDeclaration(): FunctionDeclarationItem {
        // TODO: implement arguments
        const functionStart = this.stream.next() as FunctionDeclarationToken;
        const { value: name } = functionStart;
        const variables = [];
        let patterns;
        
        this.skip('punctuation', ':');
        while (this.isIdented()) {
            if (this.isType('variable-declaration')) {
                variables.push(this.parseVariableDeclaration());
                continue;
            }
            if (patterns) {
                this.croak(`you already defined your pattern! (only variables and one pattern are allowed here)`);
            }
            patterns = this.maybeParsePatterns();
        }

        return {
            type: 'function-declaration',
            name,
            variables,
            patterns
        }
    }

    parseDefinition(): Item {
        this.stream.next();
        const definitionStart = this.stream.next();
        const { value: name } = definitionStart;
        // TODO: implement
        return {
            type: 'definition, implement me!'
        };
    }


    maybeParse(type: string, item: (token: Token) => Item) {
        if (this.isType(type)) {
            return item(this.stream.next());
        }
        return null;
    }

    maybeParseTokenPattern(type: string, item: (token: any) => any) {
        return this.maybeParse(type, token => ({
                type: 'pattern',
                patternType: type,
                ...item(token)
            })
        );
    }

    maybeParseValue() {
        return this.maybeParseTokenPattern('string', (token: StringToken) => ({
            value: token.value,
            fullWords: token.char === "'"
        })) ??
        this.maybeParseTokenPattern('regex', (token: StringToken) => ({
            value: token.value
        }));
    }

    maybeParsePatternVariable() {
        return this.maybeParseTokenPattern('variable', (token: StringToken) => ({
            name: token.value
        }));
    }

    maybeParsePatternFunction() {
        return this.maybeParseTokenPattern('identifier', (token: StringToken) => ({
            patternType: 'function',
            name: token.value
        }));
    }

    maybeParseConclude() {
        if (this.is('punctuation', '(')) {
            this.skip('punctuation', ')')
            return this.maybeParsePatterns();
        }
        return null;
    }

    maybeParseChoice() {
        if (this.is('punctuation', '[')) {
            const choices = this.delimited('[', ']', ',', this.maybeParsePatterns);
            return {
                type: 'pattern',
                patternType: 'choice',
                choices
            };
        }
        return null;
    }

    maybeParseNaming() {
        if (this.is('punctuation', '{')) {
            this.stream.next();
            // empty {}
            if (this.is('punctuation', '}')) {
                this.stream.next();
                return {
                    type: 'pattern',
                    patternType: 'emptyNaming'
                };
            }

            // naming or customNaming
            const name = this.skipType('identifier');

            // custom naming
            if (this.is('punctuation', ':')) {
                this.stream.next();
                const value = this.skipType('string');
                this.skip('punctuation', '}');
                return {
                    type: 'pattern',
                    patternType: 'customNaming',
                    key: name,
                    value
                };
            }

            // just naming
            this.skip('punctuation', '}');
            return {
                type: 'pattern',
                    patternType: 'naming',
                    name: name
            }
        }
        return null;
    }

    maybeParsePreviousMatching() {
        if (this.is('punctuation', '<=')) {
            this.stream.next();
            const patterns = this.maybeParsePatterns();
            this.skip('punctuation', '>');
            return {
                type: 'pattern',
                patternType: 'previousMatching',
                match: patterns 
            };
        }
        return null;
    }

    maybeParsePreviousNotMatching() {
        if (this.is('punctuation', '<!=')) {
            this.stream.next();
            const patterns = this.maybeParsePatterns();
            this.skip('punctuation', '>');
            return {
                type: 'pattern',
                patternType: 'previousNotMatching',
                dontMatch: patterns 
            };
        }
        return null;
    }

    maybeParseSeparator() {
        let whitespace: boolean;
        let optional: boolean;
        if (this.is('punctuation', '-')) {
            whitespace = false;
            optional = false;
        }
        else if (this.is('punctuation', '~')) {
            whitespace = false;
            optional = true;
        }
        else if (this.is('punctuation', '->')) {
            whitespace = true;
            optional = false;
        }
        else if (this.is('punctuation', '~>')) {
            whitespace = true;
            optional = true;
        }
        else {
            return null;
        }
        this.stream.next();

        return {
            type: 'pattern',
            patternType: 'separator',
            whitespace,
            optional
        };
    }

    maybeParseDelimiter(leftHand: Item) {
        // TODO: Add support for non-whitespace
        // TODO: Add min max
        if (this.is('punctuation', '=>')) {
            this.stream.next();
            const valuePatterns = this.maybeParsePatterns();
            if (!valuePatterns.length) {
                this.croak('you need to define a pattern between the delimiter');
            }

            // with separation
            let separator;
            if (this.is('punctuation', '|')) {
                this.stream.next();
                separator = this.maybeParsePatterns();
            }
            this.skip('punctuation', '<=');

            // right hand (not )
            const rightHand = this.maybeParsePatterns();
            if (!rightHand.length) {
                this.croak(`a stop pattern for the delimiter. If you want none, use <=()`);
            }


            return {
                type: 'pattern',
                patternType: 'delimitter',
                withSeparation: !!separator,
                separator,
                start: leftHand,
                values: valuePatterns,
                stop: rightHand
            };
        }
        return null;
    }

    maybeParsePatterns(): PatternItem[] {
        const patterns = [];
        // delimited: ... => ... | ... <= ...
        // separation: -, ~, ->, ~>
        const parsers = [
            this.maybeParseValue,
            this.maybeParsePatternVariable,
            this.maybeParsePatternFunction,
            this.maybeParseConclude,
            this.maybeParseChoice,
            this.maybeParsePreviousMatching,
            this.maybeParsePreviousNotMatching
        ];

        let first = true;
        while (!this.stream.eof()) {
            // separation
            if (first) {
                first = false;
            } else {
                const separator = this.maybeParseSeparator();
                if (!separator) {
                    // check for delimiters (also possible)
                    const leftHand = patterns[patterns.length - 1];
                    const delimiter = this.maybeParseDelimiter(leftHand);
                    if (!delimiter) {
                        break;
                    }
                    if (!leftHand) {
                        this.croak(`You need a starting point for the delimiter. If you want none, use '()=>'`);
                    }
                    // remove leftHand value, insert delimiter
                    patterns[patterns.length - 1] = delimiter;
                } else {
                    patterns.push(separator);
                }
            }

            // naming
            const namings = [];
            let naming;
            while (naming = this.maybeParseNaming()) {
                namings.push(naming);
            }

            // pattern
            const self = this;
            const worked = parsers.some(parser => {
                const pattern = parser.call(self);
                if (pattern) {
                    pattern.namings = namings; // add the namings
                    patterns.push(pattern);
                }
                return !!pattern;
            });
            
            if (!worked) {
                break;
            }
        }

        return patterns;
    }

    croak(message: string) {
        this.stream.croak(message);
    }
}