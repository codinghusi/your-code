import { Language, LanguageDefinitionsValue, LanguageFunctionsValue, LanguageVariablesValue } from "../your-code-language-parser/language";
import { DefinitionItem, FunctionDeclarationItem, PatternItem, VariableDeclarationItem } from "../your-code-language-parser/parser";
import { TokenInputStream } from "../your-code-language-parser/token-input-stream";
import { BlockScope } from "./block-scope";


export class YCParser {
    protected definitions: BlockScope<LanguageDefinitionsValue>;
    protected variables: BlockScope<LanguageVariablesValue>;
    protected functions: BlockScope<LanguageFunctionsValue>;

    constructor(public language: Language,
                public stream: TokenInputStream) {
        this.definitions = new BlockScope(null, language.definitions);
        this.variables = new BlockScope(null, language.globalVariables, name => `couldn't find variable '${name}'`);
        this.functions = new BlockScope(null, language.functions, name => `couldn't find function '${name}'`);
    }

    parse() {
        // FIXME: Do those checking in the language parser!
        // getting the entrypoint
        const entrypointRaw = this.definitions.get('entrypoint');
        if (!entrypointRaw || entrypointRaw.type !== 'identifier') {
            this.croak('please define an entrypoint with a function in it: !entrypoint(yourFunction)')
        }
        const entrypointFunctionName = entrypointRaw.value;

        // start parsing
        this.parseWithFunction(entrypointFunctionName);
    }

    parseWithFunction(name: string) {
        const fn = this.functions.get(name);
        this.parseWithPattern(fn.pattern);
    }

    parseWithPattern(pattern: PatternItem[]) {
        const result = pattern.map(matcher => {
            const parser = this.getPatternParser(matcher);
            return parser();
        });
        return result;
    }

    getPatternParser(matcher: PatternItem) {
        const parsers = {
            separator() {
                
            },
            // TODO: fill
        };
        return parsers[matcher.patternType];
    }

    croak(message: string) {
        this.stream.croak(message);
    }
}