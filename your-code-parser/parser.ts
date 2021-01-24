import { InputStream } from "../your-code-language-parser/input-stream";
import { Language, LanguageRawDefinitions, LanguageDefinitionValue, LanguageFunctionValue, LanguageVariableValue } from "../your-code-language-parser/language";
import { AnyItem, PatternFunctionItem, PatternItem, PatternStringItem } from "../your-code-language-parser/parser";
import { BlockScope } from "./block-scope";

interface PatternParams {
    stream: InputStream;
    varScope: BlockScope<LanguageVariableValue>;
    matcher: AnyItem;
}


export class YCParser {
    protected rawDefinitions: LanguageRawDefinitions;
    protected definitions: BlockScope<LanguageDefinitionValue>;
    protected variables: BlockScope<LanguageVariableValue>;
    protected functions: BlockScope<LanguageFunctionValue>;

    constructor(public language: Language,
                public stream: InputStream) {
        // FIXME: so broken! Some things not working if checkDefinitions wasn't executed...
        this.rawDefinitions = language.definitions;
        this.definitions = new BlockScope(null, {});
        this.variables = new BlockScope(null, language.globalVariables, name => `couldn't find variable '${name}'`);
        this.functions = new BlockScope(null, language.functions, name => `couldn't find function '${name}'`);
    }

    // FIXME: kind of wrong name ^^
    checkDefinitions() {
        const requiredDefinitions = [ 
            {
                name: 'entrypoint',
                errorMessage: 'please define an entrypoint with a function in it: !entrypoint(yourFunction)'
            }
         ];
        const definitionTypes = {
            'entrypoint': [ 'function' ],
            'import': [ 'string' ]
        };

        Object.entries(this.rawDefinitions).forEach(([defName, defValue]) => {
            let type: any = defValue.type;
            let value: any = defValue.value;

            // check if it is actually a valid definition
            if (!(defName in definitionTypes)) {
                throw new Error(`'${defName}' is not a valid name for a definition`);
            }

            // cast the functions!
            if (type === 'identifier') {
                type = 'function';
                const name = value;
                value = this.functions.get(name);
                this.functions.set(name, value);
            } else {
                value = defValue.value;
            }

            // remove from required list if it is there
            const index = requiredDefinitions.map(def => def.name).indexOf(defName);
            if (index !== -1) {
                requiredDefinitions.splice(index);
            }

            // check function type matching
            const allowedTypes = definitionTypes[defName];
            if (!allowedTypes.includes(type)) {
                throw new Error(`definition ${defName} does only allow the types: ${allowedTypes.join(', ')}`);
            }
            
            this.definitions.set(defName, value);
        });

        if (requiredDefinitions.length) {
            const names = requiredDefinitions.map(def => def.name).join(', ');
            const messages = requiredDefinitions.map(def => def.errorMessage).join('\n');
            throw new Error(`${requiredDefinitions.length} definitions missing (${names})!\n${messages}`);
        }
    }

    parse() {
        this.checkDefinitions();
        const entrypointFunctionName = (this.definitions.get('entrypoint') as LanguageFunctionValue).name;
        
        // start parsing
        this.parseWithFunction(entrypointFunctionName);
    }

    parseWithFunction(name: string) {
        const fn = this.functions.get(name);
        const scope = this.variables.newScope(fn.variables);
        this.parseWithPattern(scope, fn.pattern);
    }

    parseWithPattern(varScope: BlockScope<LanguageVariableValue>, pattern: PatternItem[]) {
        const results = [];
        for (const matcher in pattern) {
            this.stream.pushCheckPoint();
            const parser = this.getMatcherParser(varScope, matcher);
            const result = parser(matcher);
            if (result) {
                results.push(result);
            } else {
                this.stream.popCheckPoint();
                return null;
            }
        }
        return results;
    }



    getMatcherParser(varScope: BlockScope<LanguageVariableValue>, matcher: PatternItem) {
        const self = this;
        const stream = this.stream;
        const parsers = {
            string() {
                // FIXME: add whole words!!
                const str = (matcher as PatternStringItem).value;
                if (stream.matchNextString(str)) {
                    return str;
                }
                return;
            },
            regex({ value: regex }) {
                const match = stream.matchNextString(regex);
                return match;
            },
            fn() {
                return self.parseWithFunction((matcher as PatternFunctionItem).name);
            },
            variable({ name }) {
                return this.parseWithPattern(varScope.get(name));
            },
            conclude({ content }) {
                return this.parseWithPattern(content);
            },
            choice({ choices }) {
                for (const choice of choices) {
                    const result = this.parseWithPattern(choice);
                    if (result) {
                        return result;
                    }
                }
                return;
            },
            previousMatching() {
                throw 'previousMatching not implemented, sry not sry';
            },
            previousNotMatching() {
                throw 'previousNotMatching not implemented, sry not sry';
            },
            separator() {
                throw 'separator not implemented, sry not sry';
            },
            delimitter() {
                throw 'delimitter not implemented, sry not sry';
            },
            // TODO: fill
        };
        return parsers[matcher.patternType];
    }

    croak(message: string) {
        this.stream.croak(message);
    }
}