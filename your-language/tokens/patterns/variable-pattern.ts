import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { NameToken } from "../name-token";
import { Pattern } from "./pattern";
import { VariableDeclarationToken } from '../variable-declaration-token';
import { TokenCapture } from "../../token-capture";

export class VariablePattern extends Pattern {
    protected declaration: VariableDeclarationToken;

    constructor(capture: TokenCapture,
                public name: string) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        if (stream.matchNextString('$')) {
            const result = NameToken.parse(stream);
            if (!result) {
                stream.croak(`after '$' a variable name must follow`);
            }
            const name = result.name;
            return new VariablePattern(capture.finish(), name);
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