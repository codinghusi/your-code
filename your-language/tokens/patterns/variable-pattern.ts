import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { NameToken } from "../name-token";
import { Pattern } from "./pattern";
import { VariableDeclarationToken } from '../variable-declaration-token';

export class VariablePattern extends Pattern {
    protected declaration: VariableDeclarationToken;

    constructor(public name: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        if (stream.matchNextString('$')) {
            const result = NameToken.parse(stream);
            if (!result) {
                stream.croak(`after '$' a variable name must follow`);
            }
            const name = result.name;
            return new VariablePattern(name);
        }
        return null;
    }

    setDeclaration(variable: VariableDeclarationToken) {
        this.declaration = variable;
        return this;
    }

    parse(stream: CodeInputStream) {
        return this.namings.onToResult(this.declaration.parser.parse(stream), true);
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return this.declaration.parser.checkFirstWorking(stream);
    }
}