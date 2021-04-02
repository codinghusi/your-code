import { YourLanguageParser } from '../your-language/parser';
import "reflect-metadata";
import { YourCodeParser } from './parser';

const outputFile = 'output.json';
const inputFile = 'input.ycl';
const codeFile = 'code.yc';

async function parse() {
    try {
        const parser = await YourLanguageParser.onFile(inputFile);
        const language = await parser.parse();
        const codeParser = await YourCodeParser.onFile(codeFile, language);
        const result = await codeParser.parse();
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}

parse();