import { YourLanguageParser } from '../your-language/parser';
import "reflect-metadata";

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