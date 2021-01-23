import { InputStream } from "../your-code-language-parser/input-stream"
import { YCLParser } from "../your-code-language-parser/parser";
import * as fs from 'fs';

const outputFile = 'output.json';
const inputFile = 'input.ycl';

async function parse() {
    try {
        const parser = YCLParser.onFile(inputFile);
        const language = await parser.parse();
        language.saveAsJSON(outputFile);
    } catch (e) {
        console.log(e);
    }
}

parse();