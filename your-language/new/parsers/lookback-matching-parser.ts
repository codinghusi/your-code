import { LanguageInputStream } from "../../language-input-stream";
import { LanguageParser } from "../parser";
import { LookbackMatchingPattern } from "../patterns/lookback-matching-pattern";

// TODO: add support for more complex parsers (fixed length, PatternParser)

export class LookbackMatchingParser extends LanguageParser {
    parseIntern(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const check = stream.matchNextString('<=') ?? stream.matchNextString('<!=');
        if (!check) {
            return null;
        }
        const negated = check === '<!=';
        const parser = StringPattern.parse(stream);
        if (!stream.matchNextString('>')) {
            stream.croak(`missing closing '>'`);
        }
        return new LookbackMatchingPattern(parser, negated);
    }
}