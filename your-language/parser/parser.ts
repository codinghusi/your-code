import * as fs from '../../your-parser/node_modules/fs';
import { CheckParser } from '../check-parser';
import { InputStream } from '../input-stream';
import { LanguageVariables, Language } from '../language';
import { DefinitionItem, FunctionDeclarationItem, VariableDeclarationItem, YourLanguagePreParser } from '../pre-parser';
import { TokenInputStream } from '../token-input-stream';

export class YourLanguageParser {

    constructor(protected preParsed: any) { }

    static onFile(path: string) {
        const code = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.onCode(code);
    }

    static async onCode(code: string) {
        const inputStream = new InputStream(code);
        const tokenStream = new TokenInputStream(inputStream);
        const preParser = new YourLanguagePreParser(tokenStream);
        const parser = new YourLanguageParser(await preParser.parse());
        return parser;
    }

    extractByType(items: any[]) {
        const result = {};
        items.forEach(item => {
            result[item.type] = item;
        });
        return result;
    }

    parse() {

        const extracted = this.extractByType(this.preParsed);

        const variables = this.convertVariables(extracted['variable-declaration']);
        const definitions = this.convertDefinitions(extracted['definition']);


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
}