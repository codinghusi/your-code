import { InputStream } from "../../input-stream";
import { ParserToken } from "./parser-pattern";
import { Pattern } from "./pattern";


export class ConcludePattern extends Pattern {
    constructor(public content: string) {
        super();
    }

    static parse(stream: InputStream) {
        if (stream.matchNextString('(')) {
            const content = ParserToken.parse(stream);
            if (!stream.matchNextString(')')) {
                stream.croak(`missing closing )`);
            }
            return new ConcludePattern(content);
        }
      }
}