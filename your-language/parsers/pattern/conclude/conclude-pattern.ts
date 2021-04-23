import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";
import { PatternChainPattern } from "../chained/pattern-chain-pattern";

@ResultType("conclude")
export class ConcludePattern extends LanguagePattern {
    constructor(public content: PatternChainPattern) {
        super();
    }

    toString() {
        return `(${this.content})`;
    }

    async parseIntern(stream: CodeInputStream) {
        return await this.content.parse(stream);
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.content.checkFirstWorking(stream);
    }

    collectVariablesAndFunctions() {
        return this.content?.collectVariablesAndFunctions() ?? [];
    }
}