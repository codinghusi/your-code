import { VariableCollection } from "../../../collections";
import { LanguageInputStream } from "../../../language-input-stream";
import { Patterns } from "../../pattern/parsers/all-patterns";
import { PatternChainParser } from "../../pattern/parsers/pattern-chain-parser";
import { PatternChainPattern } from "../../pattern/patterns/pattern-chain-pattern";
import { LanguageToken } from "../token";


export class FunctionDeclarationToken extends LanguageToken {
    constructor(public name: string,
                public variables: VariableCollection,
                public parser: PatternChainPattern) {
        super();
    }
}
