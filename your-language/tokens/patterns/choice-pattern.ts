import { LanguageInputStream } from "../language-input-stream";
import { ParserPattern } from "./parser-pattern";
import { Pattern } from "./pattern";
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { PatternFail } from './pattern-fail';
import { Checkpoint } from "../../input-stream";


export class ChoicePattern extends Pattern {
    constructor(public choices: ParserPattern[]) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = stream.delimitedWithWhitespace('[', ']', ',', ParserPattern.parse);
        return new ChoicePattern(result);
    }

    parse(stream: CodeInputStream) {
        return this.namings.onToResult(this.parseRaw(stream));
    }

    protected parseRaw(stream: CodeInputStream) {
        let partiallyWorked: any;
        let partialCheckPoint: Checkpoint;
        for (const choice of this.choices) {
            stream.pushCheckPoint();
            try {
                const result = choice.parse(stream);
                if (stream.checkNextPattern()) {
                    return result;
                }
                if (!partiallyWorked) {
                    partialCheckPoint = stream.checkpoint;
                    partiallyWorked = result;
                }
            } catch(e) { }
            stream.popCheckPoint();
        }
        if (partiallyWorked) {
            stream.pushCheckPoint(partialCheckPoint);
            return partiallyWorked;
        }
        throw new PatternFail();
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.choices.some(choice => choice.checkFirstWorking(stream));
    }
}