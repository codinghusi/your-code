import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../language-input-stream";
import { Pattern } from "./pattern";
import { WhitespaceToken } from '../whitespace-token';


export class SeparatorPattern extends Pattern {
    constructor(public whitespace: boolean,
        public optional: boolean) {
            super();
        }
        
        static parse(stream: LanguageInputStream) {
            if (stream.matchNextString('->')) {
                return new SeparatorPattern(true, false);
            }
            if (stream.matchNextString('~>')) {
                return new SeparatorPattern(true, true);
        }
        if (stream.matchNextString('-')) {
            return new SeparatorPattern(false, false);
        }
        if (stream.matchNextString('~')) {
            return new SeparatorPattern(false, true);
        }
    }

    parse(stream: CodeInputStream) {
        if (this.whitespace) {
            return WhitespaceToken.parse(stream);
        }
        return;
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return !!this.parse(stream);
    }
}