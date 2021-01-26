import { InputStream } from "../your-language/input-stream";
import { Language, LanguageRawDefinitions, LanguageDefinitionValue, LanguageFunctionValue, LanguageVariableValue } from "../your-language/language";
import { LookbackItem, PatternFunctionItem, PatternItem, PatternStringItem } from "../your-language/pre-parser";
import { BlockScope } from "./block-scope";
import { LookbackChecker } from "./lookback-checker";

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

    parseWhitespace() {
        return this.stream.matchNextRegex(/[\s\n]+/);
    }

    isLookbackMatcher(matcher: PatternItem) {
        return !!matcher.isLookback;
    }

    parseWithPattern(varScope: BlockScope<LanguageVariableValue>, pattern: PatternItem[], parentLookbackChecker?: LookbackChecker) {
        pattern = pattern.slice(); // clone the array 'cause it will be modified
        const results = [];
        let i = 0;

        let optional = false;
        let lookbackChecker = new LookbackChecker(this.stream);
        let justGotLookback = false;

        // FIXME: two lookback matcher in a row leads to wrong results. Use queue
        // FIXME: first matcher can't be a lookback matcher
        // TODO: add namings!

        for (const matcher of pattern) {
            // preparation
            this.stream.pushCheckPoint();
            parentLookbackChecker?.check();

            // check for 'previous-matching'/'previous-not-matching' in parallel
            if (pattern.length > i + 1) {
                const nextMatcher = pattern[i + 1];
                if (this.isLookbackMatcher(nextMatcher)) {
                    const lookbackParsers = (nextMatcher as LookbackItem).lookbacks.map(lb => this.getMatcherParser(varScope, lb, lookbackChecker))
                    lookbackChecker.set(lookbackParsers, varScope);
                    lookbackChecker.check();
                    pattern.splice(i + 1);
                    justGotLookback = true;
                } else {
                    break;
                }
            }

            // get the corresponding parser
            const parser = this.getMatcherParser(varScope, matcher, lookbackChecker);

            // parse it
            const result = parser(matcher);

            // check and process the result
            if (result && (justGotLookback || lookbackChecker.result())) {
                // parsing succeed!
                // > handle separators specially
                if (matcher.patternType === 'separator') {
                    optional = result.optional;
                    if (result.whitespace) {
                        // TODO: add naming to whitespace if so wanted
                        this.parseWhitespace();
                    }
                } else {
                    results.push(result);
                }
            } else {
                // parsing failed
                this.stream.popCheckPoint();
                if (!optional) {
                    return null;
                } else {
                    continue;
                }
            }

            ++i;
        }
        return results;
    }



    getMatcherParser(varScope: BlockScope<LanguageVariableValue>, matcher: PatternItem, lookbackChecker: LookbackChecker) {
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
            separator({optional, whitespace}) {
                return {
                    optional,
                    whitespace
                };
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