import { ChoicePattern } from "../patterns/choice-pattern";
import { LanguageInputStream } from "../../../language-input-stream";
import { LanguageParser } from "../parser";
import { PatternChainPattern } from "../patterns/pattern-chain-pattern";
import { Patterns } from "./all-patterns";

export class ChoiceParser extends LanguageParser<ChoicePattern> {
    async parseIntern(stream: LanguageInputStream) {
        const choices = await stream.delimitedWithWhitespace('[', ']', ',', Patterns.chained) as PatternChainPattern[];
        if (!choices) {
            return null;
        }
        return new ChoicePattern(choices);
    }
}