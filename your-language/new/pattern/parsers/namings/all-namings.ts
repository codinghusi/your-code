import { bindMapParserContexts } from "../../../token/parser";
import { FlattenNamingParser } from "./flatten-naming";
import { KeyNamingParser } from "./key-naming";
import { KeyValueNamingParser } from "./key-value-naming";

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
