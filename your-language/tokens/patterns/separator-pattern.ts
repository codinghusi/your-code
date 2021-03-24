import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { Pattern } from "./pattern";
import { TokenCapture } from "../../token-capture";


export class SeparatorPattern extends Pattern {
    constructor(public capture: TokenCapture,
                public whitespace: boolean,
                public optional: boolean) {
            super(capture);
    }
        
    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        let whitespace: boolean = null;
        let optional: boolean = null;
        if (stream.matchNextString('->')) {
            whitespace = true;
            optional = false;
        }
        else if (stream.matchNextString('~>')) {
            whitespace = true;
            optional = true;
        }
        else if (stream.matchNextString('-')) {
            whitespace = false;
            optional = false;
        }
        else if (stream.matchNextString('~')) {
            whitespace = false;
            optional = true;
        }
        if (whitespace !== null && optional !== null) {
            return new SeparatorPattern(capture.finish(), whitespace, optional);
        }
        return null;
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