import { InputStream } from "./input-stream"
import { Parser } from "./parser";
import { TokenInputStream } from "./token-input-stream";

const code = `

@number:
//    {value} /-?\\d+(?:\\.\\d+)/

@boolean:
    [ 'true', 'false' ]

@ifCondition:
    '(' -> {} expression -> ')'

`

function parse(code: string) {
    try {
        const inputStream = new InputStream(code);
        const tokenInputStream = new TokenInputStream(inputStream);
        const parser = new Parser(tokenInputStream);
        
        const result = parser.parse();
        console.log(result);
    } catch (e) {
        console.log(e);
    }
    // console.log(tokenInputStream.next());
}

parse(code);