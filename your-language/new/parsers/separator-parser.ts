import { LanguageInputStream } from "../../language-input-stream";
import { LanguageParser } from "../parser";


export class SeparatorParser extends LanguageParser {
    parseIntern(stream: LanguageInputStream) {
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
            return new SeparatorPattern(whitespace, optional);
        }
        return null;
    }
}