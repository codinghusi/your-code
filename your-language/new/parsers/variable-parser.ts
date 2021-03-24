import { LanguageInputStream } from "../../language-input-stream";
import { LanguageParser } from "../parser";


export class VariableParser extends LanguageParser {
    parseIntern(stream: LanguageInputStream) {
        if (stream.matchNextString('$')) {
            const result = NameToken.parse(stream);
            if (!result) {
                stream.croak(`after '$' a variable name must follow`);
            }
            const name = result.name;
            return new VariablePattern(name);
        }
        return null;
    }
}