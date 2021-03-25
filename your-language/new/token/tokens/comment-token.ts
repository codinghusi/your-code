import { LanguageToken } from "../token";


export class CommentToken extends LanguageToken {
    constructor(public content: string) {
        super();
    }
}