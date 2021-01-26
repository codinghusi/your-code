import { InputStream } from "../../input-stream";
import { ParserToken } from "./parser-pattern";
import { Pattern } from "./pattern";


export class LookbackMatchingPattern extends Pattern {
    constructor(public parser: ParserToken,
                public negated: boolean) {
        super();
    }

    static parse(stream: InputStream) {
        const check = stream.matchNextString('<=') ?? stream.matchNextString('<!=');
        if (!check) {
            return null;
        }
        const negated = check === '<!=';
        const parser = ParserToken.parse(stream);
        if (!stream.matchNextString('>')) {
            stream.croak(`missing closing '>'`);
        }
        return new LookbackMatchingPattern(parser, negated);
    }
}