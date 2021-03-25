import { ChoicePattern } from "./choice-pattern";
import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../../language-parser";
import { Patterns } from "../all-patterns";
import { PatternChainPattern } from "../chained/pattern-chain-pattern";

export class ChoiceParser extends LanguageParser<ChoicePattern> {
    async parseIntern(stream: LanguageInputStream) {
        const choices = await stream.delimitedWithWhitespace('[', ']', ',', Patterns.chained) as PatternChainPattern[];
        if (!choices) {
            return null;
        }
        return new ChoicePattern(choices);
    }
}