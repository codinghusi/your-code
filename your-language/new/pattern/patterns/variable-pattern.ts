import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { VariableDeclarationToken } from "../../../tokens/variable-declaration-token";
import { LanguagePattern } from "../../pattern";

export class VariablePattern extends LanguagePattern {
    protected reference: VariableDeclarationToken;

    constructor(public name: string) {
        super();
    }

    setDeclaration(variable: VariableDeclarationToken) {
        this.reference = variable;
        return this;
    }

    parse(stream: CodeInputStream) {
        return this.namings.onToResult(this.reference.parser.parse(stream), true);
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return this.reference.parser.checkFirstWorking(stream);
    }
}