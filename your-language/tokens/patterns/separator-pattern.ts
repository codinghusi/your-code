import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { Pattern } from "./pattern";
import { WhitespaceToken } from '../whitespace-token';

interface Params {
    whitespace: boolean;
    optional: boolean;
}

export class SeparatorPattern extends Pattern {
    whitespace: boolean;
    optional: boolean;

    constructor(params: Params) {
        super();
        Object.assign(this, params);
    }
        
    static parse(stream: LanguageInputStream) {
        if (stream.matchNextString('->')) {
            return new SeparatorPattern({ whitespace: true, optional: false });
        }
        if (stream.matchNextString('~>')) {
            return new SeparatorPattern({ whitespace: true, optional: true });
        }
        if (stream.matchNextString('-')) {
            return new SeparatorPattern({ whitespace: false, optional: false });
        }
        if (stream.matchNextString('~')) {
            return new SeparatorPattern({ whitespace: false, optional: true });
        }
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