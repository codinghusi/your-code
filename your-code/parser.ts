import { Language } from '../your-language/language';
import { CodeInputStream } from '../your-parser/code-input-stream';

export class YCParser {
    constructor(protected language: Language,
                protected stream: CodeInputStream) { }

    async parse() {
        const results = [];
        const entrypoint = this.language.definitions['entrypoint'][0];
        
        while (!this.stream.eof()) {
            const result = entrypoint.value.parse(this.stream);
            results.push(result);
        }

        return results;
    }
}