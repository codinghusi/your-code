import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguagePattern } from "../pattern";


export class ConcludePattern extends LanguagePattern {
    constructor(public content: ParserPattern) {
        super();
    }

    parse(stream: CodeInputStream) {
        return this.namings.onToResult(this.content.parse(stream), true);
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.content.checkFirstWorking(stream);
    }
}