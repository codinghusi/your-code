import { ChoiceParser } from "./choice-parser";
import { ConcludeParser } from "./conclude-parser";
import { DelimiterParser } from "./delimiter-parser";
import { FunctionParser } from "./function-parser";
import { LookbackMatchingParser } from "./lookback-matching-parser";
import { PatternChainParser } from "./pattern-chain-parser";
import { RegexParser } from "./regex-parser";
import { SeparatorParser } from "./separator-parser";
import { StringParser } from "./string-parser";

export const Parsers = {
    choice: new ChoiceParser().parse,
    conclude: new ConcludeParser().parse,
    delimiter: new DelimiterParser().parse,
    function: new FunctionParser().parse,
    lookback: new LookbackMatchingParser().parse,
    chained: new PatternChainParser().parse,
    regex: new RegexParser().parse,
    separator: new SeparatorParser().parse,
    string: new StringParser().parse,
};
