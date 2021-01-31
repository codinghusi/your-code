import * as fs from 'fs';
import { DefinitionToken } from './tokens/definition-token';
import { FunctionDeclarationToken } from './tokens/function-declaration-token';
import { LanguageInputStream } from './tokens/language-input-stream';
import { ParserPattern } from './tokens/patterns/parser-pattern';
import { Pattern } from './tokens/patterns/pattern';
import { VariableDeclarationToken } from './tokens/variable-declaration-token';
import { VariablePattern } from './tokens/patterns/variable-pattern';
import { FunctionPattern } from './tokens/patterns/function-pattern';
import { Definitions, Functions, Language, Variables } from './language';



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
        const declarations = this.parseRawDeclarations();
        const language = this.prepareDelcarations(declarations);
        return language;
    }

    parseRawDeclarations() {
        const mainParsers = [
            DefinitionToken.parse,
            VariableDeclarationToken.parse,
            FunctionDeclarationToken.parse
        ];

        const declarations = [];

        while(!this.stream.eof()) {
            for (const parser of mainParsers) {
                const declaration = parser(this.stream);
                if (declaration) {
                    declarations.push(declaration);
                    break;
                }
            }
            this.stream.croak(`bumped into unexpected character`);
        }

        return declarations;
    }

    collectDefinitions(declarations: any[]): Definitions {
        const definitions = {};
        declarations.filter(declaration => (declaration instanceof DefinitionToken))
                    .forEach(definition => {
                        const name = definition.name;
                        if (!(name in definitions)) {
                            definitions[name] = [];
                        }
                        definitions[name].push(definition.value);
                    });
        return definitions;
    }

    collectFunctions(declarations: any[]): Functions {
        const functions = {};
        declarations.filter(declaration => (declaration instanceof FunctionDeclarationToken))
                    .forEach(fn => {
                        const name = fn.name;
                        if (name in functions) {
                            this.stream.croak(`function with name ${name} does already exist`);
                        }
                        functions[name] = fn;
                    });
        return functions;
    }

    collectVariables(declarations: any[]): Variables {
        const variables = {};
        declarations.filter(declaration => (declaration instanceof VariableDeclarationToken))
                    .forEach(variable => {
                        const name = variable.name;
                        if (name in variables) {
                            this.stream.croak(`variable with name ${name} does already exist`);
                        }
                        variables[name] = variable;
                    });
        return variables;
    }

    prepareParsePattern(parser: ParserPattern, functions: Functions, variables: Variables) {
        parser.patterns.forEach(pattern => {
            this.preparePattern(pattern, functions, variables);
        });
    }

    preparePattern(pattern: Pattern, functions: Functions, variables: Variables) {
        if (pattern instanceof VariablePattern) {
            const variable = variables[pattern.name];
            if (!variable) {
                this.stream.croak(`couldn't find variable with name '${pattern.name}'`);
            }
            pattern.setDeclaration(variable);
        }
        else if(pattern instanceof FunctionPattern) {
            const fn = functions[pattern.name];
            if (!fn) {
                this.stream.croak(`couldn't find variable with name '${pattern.name}'`);
            }
            pattern.setDeclaration(fn);
        }
    }

    prepareDelcarations(declarations: any[]) {
        // collegt all things
        const definitions = this.collectDefinitions(declarations);
        const functions = this.collectFunctions(declarations);
        const variables = this.collectVariables(declarations);

        // prepare variables
        Object.values(variables).forEach(variable => this.prepareParsePattern(variable.parser, functions, variables));

        // prepare functions
        Object.values(functions).forEach(fn => {
            const fnVariables = fn.variables.map();
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