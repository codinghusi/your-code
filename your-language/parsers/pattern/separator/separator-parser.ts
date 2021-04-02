import { SeparatorPattern } from './separator-pattern';
import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../../language-parser";
import { ParserType } from "../../parser";

@ParserType("separator")
export class SeparatorParser extends LanguageParser<SeparatorPattern> {
    async parseIntern(stream: LanguageInputStream) {
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