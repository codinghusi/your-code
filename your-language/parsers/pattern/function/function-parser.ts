import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../../language-parser";
import { Tokens } from "../../token/all-token-parsers";
import { FunctionPattern } from "./function-pattern";

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