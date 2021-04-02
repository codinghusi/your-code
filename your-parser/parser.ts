import { Language } from '../your-language/language';
import { FunctionDeclarationToken } from '../your-language/parsers/token/function/function-declaration-token';
import { CodeInputStream } from './code-input-stream';
import * as fs from 'fs'
import { FunctionPattern } from '../your-language/parsers/pattern/function/function-pattern';

export class YourCodeParser {
    constructor(public stream: CodeInputStream,
                public language: Language) { }

    static async onFile(path: string, language: Language) {
        const code = fs.readFileSync(path, { encoding: 'utf-8' });
        return this.onCode(code, language);
    }

    static onCode(code: string, language: Language) {
        const stream = new CodeInputStream(code);
        const parser = new YourCodeParser(stream, language);
        return parser;
    }

    async parse() {
        const results = [];
        console.log(this.language.definitions.entrypoint[0].name);
        const entrypoint = (this.language.definitions.entrypoint[0].value as FunctionPattern).reference;
        while (!this.stream.eof()) {
            const result = await entrypoint.parser.parse(this.stream);
            results.push(result);
        }
        return results;
    }
}