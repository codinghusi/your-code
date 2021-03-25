import { bindMapParserContexts } from "../token/parser";
import { ChoiceParser } from "./choice/choice-parser";
import { ConcludeParser } from "./conclude/conclude-parser";
import { DelimiterParser } from "./delimiter/delimiter-parser";
import { FunctionParser } from "./function/function-parser";
import { RegexParser } from "./regex/regex-parser";
import { SeparatorParser } from "./separator/separator-parser";
import { StringParser } from "./string/string-parser";
import { PatternChainParser } from "./chained/pattern-chain-parser";
import { LookbackMatchingParser } from "./lookback/lookback-matching-parser";
import { VariableParser } from "./variable/variable-parser";


const PatternParsers = {
    choice: new ChoiceParser(),
    conclude: new ConcludeParser(),
    delimiter: new DelimiterParser(),
    variable: new VariableParser(),
    function: new FunctionParser(),
    lookback: new LookbackMatchingParser(),
    chained: new PatternChainParser(),
    regex: new RegexParser(),
    separator: new SeparatorParser(),
    string: new StringParser(),
};

export const Patterns = {
    choice: PatternParsers.choice.parse,
    conclude: PatternParsers.conclude.parse,
    delimiter: PatternParsers.delimiter.parse,
    variable: PatternParsers.variable.parse,
    function: PatternParsers.function.parse,
    lookback: PatternParsers.lookback.parse,
    chained: PatternParsers.chained.parse,
    regex: PatternParsers.regex.parse,
    separator: PatternParsers.separator.parse,
    string: PatternParsers.string.parse,
};

bindMapParserContexts(Patterns, PatternParsers);
