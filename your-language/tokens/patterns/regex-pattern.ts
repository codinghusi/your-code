import { InputStream } from "../../input-stream";
import { Pattern } from "./pattern";


export class RegexPattern extends Pattern {
    constructor(public value: RegExp) {
        super();
    }

    static parse(stream: InputStream) {
        if (stream.matchNextString('/')) {
            const result = stream.readUntil('/', true, '\\');
            const regex = new RegExp(result);
            return new RegexPattern(regex);
        }
        return null;
    }
}