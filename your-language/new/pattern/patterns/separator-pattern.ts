import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from '../pattern';
import { Type } from "../../parser-result";

@Type("separator")
export class SeparatorPattern extends LanguagePattern {
    constructor(public whitespace: boolean,
                public optional: boolean) {
        super();
    }

    parse(stream: CodeInputStream) {
        // FIXME: not finished
        if (this.whitespace) {
            return stream.matchWhitespace();
        }
        return;
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return !!this.parse(stream);
    }
}