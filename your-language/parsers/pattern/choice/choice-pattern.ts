import { Checkpoint } from "../../../input-stream";
import { CodeInputStream } from '../../../../your-parser/code-input-stream';
import { ResultType } from "../../parser-result";
import { PatternChainPattern } from "../chained/pattern-chain-pattern";
import { LanguagePattern } from "../../language-pattern";
import { CodeError } from "../../../../your-parser/errors/code-error";
import { FunctionPattern } from "../function/function-pattern";
import { VariablePattern } from "../variable/variable-pattern";

@ResultType("choice")
export class ChoicePattern extends LanguagePattern {
    constructor(public choices: PatternChainPattern[]) {
        super();
    }

    toString() {
        return `[ ${this.choices.join(', ')} ]`;
    }

    async parse(stream: CodeInputStream) {
        return this.namings.onToResult(await this.parseRaw(stream));
    }

    protected async parseRaw(stream: CodeInputStream) {
        let partiallyWorked: any;
        let partialCheckPoint: Checkpoint;
        for (const choice of this.choices) {
            stream.pushCheckpoint();
            try {
                const result = await choice.parse(stream);
                if (await stream.checkNextPattern()) {
                    stream.applyCheckPoint();
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
        throw new CodeError(`choice didn't work: ${this}`);
    }

    async checkFirstWorking(stream: CodeInputStream) {
        for (const choice of this.choices) {
            if (await choice.checkFirstWorking(stream)) {
                return true;
            }
        }
        return false;
    }

    collectVariablesAndFunctions() {
        return [].concat(...this.choices.map(pattern => pattern.collectVariablesAndFunctions()));
    }
}