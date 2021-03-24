import { LanguageInputStream } from "../../language-input-stream";
import { ChoicePattern } from "../patterns/choice-pattern";
import { LanguageParser } from "../parser";
import { Parsers } from "./parsers";
import { PatternChainPattern } from "../patterns/pattern-chain-pattern";


export class ChoiceParser extends LanguageParser {
    async parseIntern(stream: LanguageInputStream) {
        const choices = await stream.delimitedWithWhitespace('[', ']', ',', Parsers.chained) as PatternChainPattern[];
        if (!choices) {
            return null;
        }
        return new ChoicePattern(choices);
    }
}