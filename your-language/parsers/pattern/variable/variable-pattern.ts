import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { ResultType } from "../../parser-result";
import { VariableDeclarationToken } from "../../token/variable/variable-declaration-token";

@ResultType("variable")
export class VariablePattern extends LanguagePattern {
    protected reference: VariableDeclarationToken;

    constructor(public name: string) {
        super();
    }

    toString() {
        return `$${this.name}`;
    }

    toJSON() {
        const data = {...this};
        delete data.reference;
        return data;
    }

    setDeclaration(variable: VariableDeclarationToken) {
        console.log("set declaration for $" + this.name);
        this.reference = variable;
        return this;
    }

    async parseIntern(stream: CodeInputStream) {
        return this.namings.onToResult(await this.reference.parser.parse(stream), true);
    }
    
    checkFirstWorking(stream: CodeInputStream) {
        return this.reference.parser.checkFirstWorking(stream);
    }

    collectVariablesAndFunctions() {
        return [this];
    }
}