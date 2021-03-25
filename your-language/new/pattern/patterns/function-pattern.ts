import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { FunctionDeclarationToken } from "../../token/tokens/function-declaration-token";
import { LanguagePattern } from '../pattern';
import { Type } from "../../parser-result";

// TODO: how to work with references
@Type("function")
export class FunctionPattern extends LanguagePattern {
    static type = "function";
    reference: FunctionDeclarationToken;

    constructor(public name: string) {
        super();
    }

    toJSON() {
        const data = {...this};
        delete data.reference;
        return data;
    }
    
    setDeclaration(declaration: FunctionDeclarationToken) {
        this.reference = declaration;
        return this;
    }

    parse(stream: CodeInputStream) {
        const result = this.reference.parser.parse(stream);
        return {
            type: this.name,
            ...result
        };
    }

    checkFirstWorking(stream: CodeInputStream): boolean {
        return this.reference.parser.checkFirstWorking(stream);
    }
}