import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";
import { FunctionDeclarationToken } from "../../token/function/function-declaration-token";

// TODO: how to work with references
@ResultType("function")
export class FunctionPattern extends LanguagePattern {
    reference: FunctionDeclarationToken;

    constructor(public name: string) {
        super();
    }

    toString() {
        // return `${this.name}: ${this.reference.parser}`;
        return `${this.name}`;
    }

    toJSON() {
        const data = {...this};
        delete data.reference;
        return data;
    }
    
    setDeclaration(declaration: FunctionDeclarationToken) {
        console.log("set declaration for " + this.name);
        this.reference = declaration;
        return this;
    }

    async parse(stream: CodeInputStream) {
        const result = await this.reference.parser.parse(stream);
        return {
            type: this.name,
            ...result
        };
    }

    checkFirstWorking(stream: CodeInputStream) {
        return this.reference.parser.checkFirstWorking(stream);
    }

    collectVariablesAndFunctions() {
        return [this];
    }
}