import { InputStream } from "../your-code-language-parser/input-stream"
import { Parser } from "../your-code-language-parser/parser";
import { TokenInputStream } from "../your-code-language-parser/token-input-stream";
import * as fs from 'fs';

const outputFile = 'output.json';
const inputFile = 'input.ycl';

function parse(code: string) {
    try {
        const inputStream = new InputStream(code);
        const tokenInputStream = new TokenInputStream(inputStream);
        const parser = new Parser(tokenInputStream);
        
        const result = parser.parse();
        const json = JSON.stringify(result, undefined, 2);
        fs.writeFileSync(outputFile, json);
        console.log('wrote file to ' + outputFile);
    } catch (e) {
        console.log(e);
    }
    // console.log(tokenInputStream.next());
}

const code = fs.readFileSync(inputFile, {
    encoding: 'utf-8'
});
parse(code);