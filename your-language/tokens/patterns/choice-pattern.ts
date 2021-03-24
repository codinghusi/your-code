import { LanguageInputStream } from "../../language-input-stream";
import { ParserPattern } from './parser-pattern';
import { Pattern } from "./pattern";
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { PatternFail } from './pattern-fail';
import { Checkpoint } from "../../input-stream";
import { TokenCapture } from "../../token-capture";


export class ChoicePattern extends Pattern {
    constructor(capture: TokenCapture,
                public choices: ParserPattern[]) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = stream.delimitedWithWhitespace('[', ']', ',', ParserPattern.parse.bind(ParserPattern)) as ParserPattern[];
        if (!result) {
            return null;
        }
        return new ChoicePattern(capture.finish(), result);
    }

    parse(stream: CodeInputStream) {
        return this.namings.onToResult(this.parseRaw(stream));
    }

    protected parseRaw(stream: CodeInputStream) {
        let partiallyWorked: any;
        let partialCheckPoint: Checkpoint;
        for (const choice of this.choices) {
            stream.pushCheckpoint();
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
            stream.popCheckpoint();
        }
        if (partiallyWorked) {
            stream.pushCheckpoint(partialCheckPoint);
            return partiallyWorked;
        }
        throw new PatternFail();
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.choices.some(choice => choice.checkFirstWorking(stream));
    }
}