import { LanguageInputStream } from "../language-input-stream";
import { ParserPattern } from "./parser-pattern";
import { Pattern } from "./pattern";


export class ChoicePattern extends Pattern {
    constructor(public choices: ParserPattern[]) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = stream.delimitedWithWhitespace('[', ']', ',', ParserPattern.parse);
        return new ChoicePattern(result);
    }
}