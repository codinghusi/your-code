import { LanguageToken } from "../token";

export class NameToken extends LanguageToken {
    constructor(public name: string) {
        super();
    }
}