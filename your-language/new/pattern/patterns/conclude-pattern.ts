import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from '../pattern';
import { Type } from "../../parser-result";
import { PatternChainPattern } from "./pattern-chain-pattern";

@Type("conclude")
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