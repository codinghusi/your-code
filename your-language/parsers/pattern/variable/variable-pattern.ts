import { CodeInputStream } from "../../../../your-parser/code-input-stream";
import { LanguagePattern } from "../../language-pattern";
import { PatternType } from "../../parser-result";
import { VariableDeclarationToken } from "../../token/variable/variable-declaration-token";

@PatternType("variable")
export class VariablePattern extends LanguagePattern {
    protected reference: VariableDeclarationToken;

    constructor(public name: string) {
        super();
    }

    toJSON() {
        const data = {...this};
        delete data.reference;
        return data;
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