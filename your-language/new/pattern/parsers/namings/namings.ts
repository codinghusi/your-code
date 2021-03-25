import { FlattenNamingParser } from "./flatten-naming";
import { KeyNamingParser } from "./key-naming";
import { KeyValueNamingParser } from "./key-value-naming";

export const Namings = {
    key: new KeyNamingParser().parse,
    keyValue: new KeyValueNamingParser().parse,
    flatten: new FlattenNamingParser().parse
};
