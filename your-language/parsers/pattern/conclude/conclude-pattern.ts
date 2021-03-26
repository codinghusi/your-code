import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { PatternType } from "../../parser-result";
import { PatternChainPattern } from "../chained/pattern-chain-pattern";

@PatternType("conclude")
export class ConcludePattern extends LanguagePattern {
    constructor(public content: PatternChainPattern) {
        super();
    }

    parse(stream: CodeInputStream) {
        return this.namings.onToResult(this.content.parse(stream), true);
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.content.checkFirstWorking(stream);
    }
}