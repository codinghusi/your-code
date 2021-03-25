import * as fs from 'fs';
import { Declaration, Definitions, Functions, Language, Variables } from './language';
import { LanguageInputStream } from './language-input-stream';
import { VariablePattern } from './parsers/pattern/variable/variable-pattern';
import { Tokens } from './parsers/token/all-token-parsers';
import { PatternChainPattern } from './parsers/pattern/chained/pattern-chain-pattern';
import { FunctionPattern } from './parsers/pattern/function/function-pattern';
import { DefinitionToken } from './parsers/token/definition/definition-token';
import { FunctionDeclarationToken } from './parsers/token/function/function-declaration-token';
import { VariableDeclarationToken } from './parsers/token/variable/variable-declaration-token';
import { LanguagePattern } from './parsers/language-pattern';

export class YourLanguageParser {

    constructor(protected stream: LanguageInputStream) { }

    static onFile(path: string) {
        const code = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.onCode(code);
    }

    static async onCode(code: string) {
        const stream = new LanguageInputStream(code);
        const parser = new YourLanguageParser(stream);
        return parser;
    }

    async parse() {
        const declarations = await this.parseRawDeclarations();
        const language = await this.prepareDelcarations(declarations);
        return language;
    }

    async parseRawDeclarations() {
        const mainParsers = [
            Tokens.definition,
            Tokens.variable,
            Tokens.function,
        ];

        const declarations = [];

        mainLoop:
        while(!this.stream.eof()) {
            this.stream.matchWhitespace();
            for (const parser of mainParsers) {
                const declaration = await parser(this.stream);
                if (declaration) {
                    declarations.push(declaration);
                    continue mainLoop;
                }
            }
            this.stream.croak(`bumped into unexpected character`);
        }

        return declarations;
    }

    collectDefinitions(declarations: Declaration[]): Definitions {
        const definitions = {};
        declarations.filter(declaration => (declaration instanceof DefinitionToken))
                    .forEach((definition: DefinitionToken) => {
                        const name = definition.name;
                        if (!(name in definitions)) {
                            definitions[name] = [];
                        }
                        definitions[name].push(definition.value);
                    });
        return definitions;
    }

    collectFunctions(declarations: Declaration[]): Functions {
        const functions = {};
        declarations.filter(declaration => (declaration instanceof FunctionDeclarationToken))
                    .forEach(fn => {
                        const name = fn.name;
                        if (name in functions) {
                            this.stream.croakWithTokenCapture(`function with name ${name} does already exist`, fn.tokenCapture);
                        }
                        functions[name] = fn;
                    });
        return functions;
    }

    collectVariables(declarations: Declaration[]): Variables {
        const variables = {};
        declarations.filter(declaration => (declaration instanceof VariableDeclarationToken))
                    .forEach(variable => {
                        const name = variable.name;
                        if (name in variables) {
                            this.stream.croakWithTokenCapture(`variable with name ${name} does already exist`, variable.tokenCapture);
                        }
                        variables[name] = variable;
                    });
        return variables;
    }

    prepareParsePattern(parser: PatternChainPattern, functions: Functions, variables: Variables) {
        parser.patterns.forEach(pattern => {
            this.preparePattern(pattern, functions, variables);
        });
    }

    preparePattern(pattern: LanguagePattern, functions: Functions, variables: Variables) {
        if (pattern instanceof VariablePattern) {
            const variable = variables[pattern.name];
            if (!variable) {
                this.stream.croakWithTokenCapture(`couldn't find variable with name '${pattern.name}'`, pattern.tokenCapture);
            }
            pattern.setDeclaration(variable);
        }
        else if(pattern instanceof FunctionPattern) {
            const fn = functions[pattern.name];
            if (!fn) {
                this.stream.croakWithTokenCapture(`couldn't find function with name '${pattern.name}'`, pattern.tokenCapture);
            }
            pattern.setDeclaration(fn);
        }
    }

    async prepareDelcarations(declarations: Declaration[]) {
        // collegt all things
        const definitions = this.collectDefinitions(declarations);
        const functions = this.collectFunctions(declarations);
        const variables = this.collectVariables(declarations);

        // prepare variables
        Object.values(variables)
            .map(variable => variable.parser)
            .forEach(parser => this.prepareParsePattern(parser, functions, variables));

        // prepare functions
        Object.values(functions).forEach(fn => {
            const fnVariables = fn.variables.map() as Variables;
            const allVariables = { ...variables, ...fnVariables };
            Object.values(fnVariables).forEach(variable => this.prepareParsePattern(variable.parser, functions, allVariables));
            return this.prepareParsePattern(fn.parser, functions, allVariables);
        });

        // prepare definitions
        Object.values(definitions).forEach(list => list.forEach(definition => {
            this.preparePattern(definition.value, functions, variables);
        }));

        // required definitions
        const requiredDefinitions = [ 'entrypoint' ];
        const missingDefinitions = requiredDefinitions.filter(name => !(name in definitions));
        if (missingDefinitions.length) {
            throw new Error(`You need to implement the following definitions: ${missingDefinitions}`);
        }

        return new Language(definitions, functions, variables);
    }
}
