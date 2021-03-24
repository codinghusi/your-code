import { LanguageInputStream } from "../../language-input-stream";
import { LanguageParser } from "../parser";
import { FunctionPattern } from "../patterns/function-pattern";


export class FunctionParser extends LanguageParser {
    parseIntern(stream: LanguageInputStream) {
        const result = NameToken.parse(stream);
        if (result) {
            const name = result.name;
            return new FunctionPattern(name);
        }
        return null;
    }
}