import { LanguageInputStream } from "../../../language-input-stream";
import { Tokens } from "../../token/parsers/all-token-parsers";
import { LanguageParser } from "../parser";
import { VariablePattern } from "../patterns/variable-pattern";


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