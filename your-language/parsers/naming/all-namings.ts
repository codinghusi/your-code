import { bindMapParserContexts } from "../token/parser";
import { FlattenNamingParser } from "./flatten/flatten-naming";
import { KeyValueNamingParser } from "./key-value/key-value-naming-parser";
import { KeyNamingParser } from "./key/key-naming-parser";

const NamingParsers = {
    key: new KeyNamingParser(),
    keyValue: new KeyValueNamingParser(),
    flatten: new FlattenNamingParser()
}

export const Namings = {
    key: NamingParsers.key.parse,
    keyValue: NamingParsers.keyValue.parse,
    flatten: NamingParsers.flatten.parse
};

bindMapParserContexts(Namings, NamingParsers);
