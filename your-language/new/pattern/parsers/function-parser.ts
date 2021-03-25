import { FunctionPattern } from "../patterns/function-pattern";
import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../parser";
import { Tokens } from "../../token/parsers/token-parsers";

export class FunctionParser extends LanguageParser<FunctionPattern> {
    async parseIntern(stream: LanguageInputStream) {
        const result = await Tokens.name(stream);
        if (result) {
            const name = result.name;
            return new FunctionPattern(name);
        }
        return null;
    }
}