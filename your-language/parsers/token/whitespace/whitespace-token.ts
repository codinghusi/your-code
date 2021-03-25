import { LanguageToken } from "../token";


export class WhitespaceToken extends LanguageToken {
    constructor(public whitespace: string) {
        super();
    }

    isIdented() {
        const result = /[\t ]+$/.test(this.whitespace);
        return result;
    }
}
