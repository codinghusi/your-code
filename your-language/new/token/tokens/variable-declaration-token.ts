import { PatternChainPattern } from "../../pattern/patterns/pattern-chain-pattern";
import { LanguageToken } from "../token";


export class VariableDeclarationToken extends LanguageToken {
    constructor(public name: string,
                public isConstant: boolean,
                public parser: PatternChainPattern) {
        super();
    }
}
