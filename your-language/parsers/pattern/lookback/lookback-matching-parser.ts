import { LanguageInputStream } from "../../../language-input-stream";
import { Patterns } from "../all-patterns";
import { LanguageParser } from "../../language-parser";
import { LookbackMatchingPattern } from "./lookback-matching-pattern";

// TODO: add support for more complex parsers (fixed length, PatternParser)

export class LookbackMatchingParser extends LanguageParser<LookbackMatchingPattern> {
    async parseIntern(stream: LanguageInputStream) {
        const check = stream.matchNextString('<=') ?? stream.matchNextString('<!=');
        if (!check) {
            return null;
        }
        const negated = check === '<!=';
        const parser = await Patterns.string(stream);
        if (!stream.matchNextString('>')) {
            stream.croak(`missing closing '>'`);
        }
        return new LookbackMatchingPattern(parser, negated);
    }
}