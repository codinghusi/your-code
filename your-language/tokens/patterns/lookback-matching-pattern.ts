import { InputStream } from "../../input-stream";
import { Pattern } from "./pattern";
import { LanguageInputStream } from "../language-input-stream";
import { ParserPattern } from "./parser-pattern";


export class LookbackMatchingPattern extends Pattern {
    constructor(public parser: ParserPattern,
                public negated: boolean) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const check = stream.matchNextString('<=') ?? stream.matchNextString('<!=');
        if (!check) {
            return null;
        }
        const negated = check === '<!=';
        const parser = ParserPattern.parse(stream);
        if (!stream.matchNextString('>')) {
            stream.croak(`missing closing '>'`);
        }
        return new LookbackMatchingPattern(parser, negated);
    }
}