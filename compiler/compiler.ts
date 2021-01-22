import { InputStream } from "./input-stream"
import { Parser } from "./parser";
import { TokenInputStream } from "./token-input-stream";
import * as fs from 'fs';

const code = `

@number:
    {value} /-?\\d+(?:\\.\\d+)/

@boolean:
    [ 'true', 'false' ]

@ifCondition:
    '(' -> {} expression -> ')'

@comment:
    {content} [
        '//' => {} $allChars <= '\\n',
        '/*' => {} $allChars <= '*/'
    ]

`;

const file = 'output.json';

function parse(code: string) {
    try {
        const inputStream = new InputStream(code);
        const tokenInputStream = new TokenInputStream(inputStream);
        const parser = new Parser(tokenInputStream);
        
        const result = parser.parse();
        const json = JSON.stringify(result, undefined, 2);
        fs.writeFileSync(file, json);
        console.log('wrote file to ' + file);
    } catch (e) {
        console.log(e);
    }
    // console.log(tokenInputStream.next());
}

parse(code);