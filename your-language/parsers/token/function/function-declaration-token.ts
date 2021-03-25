import { VariableCollection } from "../../../collections";
import { PatternChainPattern } from "../../pattern/chained/pattern-chain-pattern";
import { LanguageToken } from "../token";


export class FunctionDeclarationToken extends LanguageToken {
    constructor(public name: string,
                public variables: VariableCollection,
                public parser: PatternChainPattern) {
        super();
    }
}
