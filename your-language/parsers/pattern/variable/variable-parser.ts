import { LanguageInputStream } from "../../../language-input-stream";
import { Tokens } from "../../token/all-token-parsers";
import { LanguageParser } from "../../language-parser";
import { VariablePattern } from "./variable-pattern";
import { ParserType } from "../../parser";

@ParserType("variable")
export class VariableParser extends LanguageParser<VariablePattern> {
    async parseIntern(stream: LanguageInputStream) {
        if (stream.matchNextString('$')) {
            const result = await Tokens.name(stream);
            if (!result) {
                stream.croak(`after '$' a variable name must follow`);
            }
            const name = result.name;
            return new VariablePattern(name);
        }
        return null;
    }
}