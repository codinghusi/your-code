import { LanguagePattern } from "../../language-pattern";
import { LanguageToken } from "../token";

export class DefinitionToken extends LanguageToken {
    constructor(public name: string,
                public value: LanguagePattern) {
        super();
    }
}