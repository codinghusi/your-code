import { LanguageInputStream } from "../language-input-stream";
import { ParserPattern } from "./parser-pattern";
import { Pattern } from "./pattern";
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { PatternFail } from './pattern-fail';


export class ChoicePattern extends Pattern {
    constructor(public choices: ParserPattern[]) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = stream.delimitedWithWhitespace('[', ']', ',', ParserPattern.parse);
        return new ChoicePattern(result);
    }

    * _parse(stream: CodeInputStream) {
        for (const choice of this.choices) {
            const result = choice.softParse(stream);
            if (result) {
                yield result;
            }
        }
        throw new PatternFail();
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.choices.some(choice => choice.checkFirstWorking(stream));
    }
}