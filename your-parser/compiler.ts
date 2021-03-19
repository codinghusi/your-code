import * as fs from 'fs';
import { InputStream } from '../your-language/input-stream';
import { YourLanguageParser } from '../your-language/parser';

const outputFile = 'output.json';
const inputFile = 'input.ycl';

async function parse() {
    try {
        const parser = await YourLanguageParser.onFile(inputFile);
        const language = await parser.parse();
        language.saveAsJSON(outputFile);
    } catch (e) {
        console.log(e);
    }
}

parse();