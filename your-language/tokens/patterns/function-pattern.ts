import { NameToken } from "../name-token";
import { Pattern } from "./pattern";
import { LanguageInputStream } from "../language-input-stream";
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { FunctionDeclarationToken } from '../function-declaration-token';


export class FunctionPattern extends Pattern {
    declaration: FunctionDeclarationToken;

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

    setDeclaration(declaration: FunctionDeclarationToken) {
        this.declaration = declaration;
        return this;
    }

    _parse(stream: CodeInputStream) {
        const result = this.declaration.parser._parse(stream);
        return {
            type: this.name,
            ...result
        };
    }

    checkFirstWorking(stream: CodeInputStream): boolean {
        return this.declaration.parser.checkFirstWorking(stream);
    }
}