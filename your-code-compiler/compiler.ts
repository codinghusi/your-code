import { InputStream } from "../your-language/input-stream"
import { YourLanguagePreParser } from "../your-language/pre-parser";
import * as fs from 'fs';

const outputFile = 'output.json';
const inputFile = 'input.ycl';

async function parse() {
    try {
        const parser = YourLanguagePreParser.onFile(inputFile);
        const language = await parser.parse();
        language.saveAsJSON(outputFile);
    } catch (e) {
        console.log(e);
    }
}

parse();