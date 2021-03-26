import { Checkpoint } from "../../../input-stream";
import { CodeInputStream } from '../../../../your-parser/code-input-stream';
import { PatternType } from "../../parser-result";
import { PatternChainPattern } from "../chained/pattern-chain-pattern";
import { LanguagePattern } from "../../language-pattern";

@PatternType("choice")
export class ChoicePattern extends LanguagePattern {
    constructor(public choices: PatternChainPattern[]) {
        super();
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
        throw new Error();
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.choices.some(choice => choice.checkFirstWorking(stream));
    }
}