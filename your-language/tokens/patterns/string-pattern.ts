import { InputStream } from "../../input-stream";
import { Pattern } from "./pattern";


export class StringPattern extends Pattern {
    constructor(public value: string,
                public wholeWordsOnly: boolean) {
        super();
    }

    static parse(stream: InputStream) {
        const char = stream.matchOneOf([ `"`, `'` ]);
        if (char) {
            const result = stream.readUntil(char, true, '\\');
            const wholeWordsOnly = char === `'`;
            return new StringPattern(result, wholeWordsOnly);
        }
        return null;
    }
}