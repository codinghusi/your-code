import { Language, LanguageVariables } from "./language";
import { FunctionDeclarationToken, RegexToken, StringToken, Token, TokenInputStream, VariableDeclarationToken } from "./token-input-stream";
import * as fs from '../your-parser/node_modules/fs';
import { InputStream } from "./input-stream";
import { CheckParser } from "./check-parser";

export type AnyItem = PatternStringItem | PatternRegexItem | DefinitionItem | VariableDeclarationItem | FunctionDeclarationItem | PatternItem

export interface Item {
    type: string;
}

export interface PatternStringItem extends Item {
    patternType: 'string';
    fullWords?: boolean;
    value: string;
}

export interface PatternRegexItem extends Item {
    patternType: 'regex';
    value: RegExp;
}

export interface DefinitionItem extends Item {
    name: string;
    value: Item
}

export interface VariableDeclarationItem extends Item {
    name: string;
    isConstant: boolean;
    pattern: PatternItem[];
}

export interface PatternVariableItem extends PatternItem {
    name: string;
}

export interface PatternFunctionItem extends PatternItem {
    name: string;
}

export interface FunctionDeclarationItem extends Item {
    name: string;
    patterns: PatternItem[];
    variables: VariableDeclarationItem[];
}

export interface PatternItem extends Item {
    type: 'pattern';
    patternType: string;
    isLookback?: boolean;
}

export interface LookbackItem extends PatternItem {
    patternType: 'lookbacks';
    lookbacks: PatternItem[];
}

type ParserThing = () => Item | any;

export class YourLanguagePreParser {
    constructor(protected stream: TokenInputStream) { }

    // -- utils

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

    
    // -- special utils

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

    
    // -- core

    async parse() {
        const raw = await this.preParse();

        function convertVariables(variables: VariableDeclarationItem[]): LanguageVariables {
            return variables.reduce((variables, variable: VariableDeclarationItem) => {
                    const { name, patterns } = variable;
                    variables[name] = patterns;
                    return variables;
                }, {});
        }

        // convert definitions to | name: value
        const definitions = raw
            .filter(expr => expr.type === 'definition')
            .reduce((definitions, definition: DefinitionItem) => {
                const { name, value } = definition;
                definitions[name] = value;
                return definitions;
            }, {});


        // FIXME: Fix naming convention of pattern (maybe one is a matcher, the whole is a pattern)
        // convert functions to | name: { variables, pattern }
        const functions = raw
            .filter(expr => expr.type === 'function-declaration')
            .reduce((functions, fn: FunctionDeclarationItem) => {
                const { name, variables: rawVariables, patterns } = fn;
                const variables = convertVariables(rawVariables);
                functions[name] = {
                    name,
                    variables,
                    pattern: patterns
                };
                return functions;
            }, {});

        // convert variables to | name: pattern
        const globalVariables = convertVariables(raw.filter(expr => expr.type === 'variable-declaration') as VariableDeclarationItem[]);
        
        // generate the language and check with a modified parser (check-parser)
        const language = new Language(definitions, functions, globalVariables);
        const checkParser = new CheckParser(language, null);
        checkParser.check();
        return language;
    }

    private async preParse() {
        const definitions: AnyItem[] = [];
        while (!this.stream.eof()) {
            let definition: AnyItem;
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
        const value = whitespace.value;
        if (whitespace.type === 'whitespace'
        &&  value.indexOf('\n') !== -1
        &&  value.charAt(value.length - 1) !== '\n') {
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
            const readPatterns = this.maybeParsePatterns();
            if (readPatterns.length) {
                if (patterns) {
                    this.croak(`you already defined your pattern! (only variables and one pattern are allowed here)`);
                }
                patterns = readPatterns;
            } else {
                this.croak(`either declare a variable or a pattern inside the function '${name}'`);
            }
        }
        return {
            type: 'function-declaration',
            name,
            variables,
            patterns
        }
    }

    parseDefinition(): DefinitionItem {
        this.stream.next();
        const { value: name } = this.stream.next();

        this.skip('punctuation', '(');

        let value;
        const fn = this.maybeParsePatternFunction();
        if (fn) {
            value = fn;
        } else {
            const str = this.maybeParseString();
            if (str && str.patternType === 'string') {
                value = str;
            } else {
                this.croak(`definitions may only contain a string or a function`);
            }
        }
        this.skip('punctuation', ')');
        return {
            type: 'definition',
            name,
            value
        };
    }


    maybeParse<T>(type: string, item: (token: Token) => T) {
        if (this.isType(type)) {
            return item(this.stream.next());
        }
        return null;
    }

    maybeParseTokenPattern<T>(type: string, item: (token: any) => T) {
        return this.maybeParse(type, token => ({
                type: 'pattern',
                patternType: type,
                ...item(token)
            })
        );
    }

    maybeParseString(): PatternStringItem {
        return this.maybeParseTokenPattern('string', (token: StringToken) => ({
            value: token.value,
            fullWords: token.char === "'"
        })) as PatternStringItem;
    }

    maybeParseRegex(): PatternRegexItem {
        return this.maybeParseTokenPattern('regex', (token: RegexToken) => ({
            value: token.value
        })) as unknown as PatternRegexItem;
    }

    maybeParsePatternVariable() {
        return this.maybeParseTokenPattern('variable', (token: StringToken) => ({
            name: token.value
        })) as unknown as PatternVariableItem;
    }

    maybeParsePatternFunction() {
        return this.maybeParseTokenPattern('identifier', (token: StringToken) => ({
            patternType: 'function',
            name: token.value
        })) as unknown as PatternFunctionItem;
    }

    maybeParseConclude() {
        if (this.is('punctuation', '(')) {
            this.stream.next();
            const content = this.maybeParsePatterns();
            this.skip('punctuation', ')');
            return {
                type: 'pattern',
                patternType: 'conclude',
                content
            };
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
                match: patterns,
                isLookback: true
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
                dontMatch: patterns,
                isLookback: true
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
        let lookbacks = [];
        // delimited: ... => ... | ... <= ...
        // separation: -, ~, ->, ~>
        const parsers = [
            this.maybeParseString,
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
            const separator = this.maybeParseSeparator();
            if (!separator) {
                if (!first) {
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
                }
            } else {
                patterns.push(separator);
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
                    // catch lookbacks
                    if (pattern.isLookback) {
                        lookbacks.push(pattern);
                    } else {
                        // push all lookbacks if some were declared
                        // TODO: naming in lookbacks? 
                        if (lookbacks.length) {
                            patterns.push({
                                type: 'pattern',
                                patternType: 'lookbacks',
                                lookbacks
                            });
                            lookbacks = [];
                        }
                        pattern.namings = namings; // add the namings
                        patterns.push(pattern);
                    }
                }
                return !!pattern;
            });
            
            if (!worked) {
                break;
            }
            
            first = false;
        }

        return patterns;
    }

    croak(message: string) {
        this.stream.croak(message);
    }
}