import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LanguageInputStream } from "../../language-input-stream";
import { NameToken } from "../name-token";
import { Pattern, Type } from "./pattern";
import { VariableDeclarationToken } from '../variable-declaration-token';
import { TokenCapture } from "../../token-capture";


@Type("variable")
export class VariablePattern extends Pattern {
    protected reference: VariableDeclarationToken;

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

    toJSON() {
        const data: any = {...this};
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