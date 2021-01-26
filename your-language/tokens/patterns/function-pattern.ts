import { NameToken } from "../name-token";
import { Pattern } from "./pattern";
import { LanguageInputStream } from "../language-input-stream";


export class FunctionPattern extends Pattern {
    constructor(public name: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        const result = NameToken.parse(stream);
        if (result) {
            const name = result.name;
            return new FunctionPattern(name);
        }
        return null;
    }
}