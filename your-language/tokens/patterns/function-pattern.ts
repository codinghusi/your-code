import { NameToken } from "../name-token";
import { Pattern } from "./pattern";
import { LanguageInputStream } from "../../language-input-stream";
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { FunctionDeclarationToken } from '../function-declaration-token';
import { TokenCapture } from "../../token-capture";


export class FunctionPattern extends Pattern {
    static type = "function";
    declaration: FunctionDeclarationToken;

    constructor(capture: TokenCapture,
                public name: string) {
        super(capture);
    }
    
    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = NameToken.parse(stream);
        if (result) {
            const name = result.name;
            return new FunctionPattern(capture.finish(), name);
        }
        return null;
    }

    setDeclaration(declaration: FunctionDeclarationToken) {
        this.declaration = declaration;
        return this;
    }

    parse(stream: CodeInputStream) {
        const result = this.declaration.parser.parse(stream);
        return {
            type: this.name,
            ...result
        };
    }

    checkFirstWorking(stream: CodeInputStream): boolean {
        return this.declaration.parser.checkFirstWorking(stream);
    }
}