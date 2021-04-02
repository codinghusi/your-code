import { BlockScope } from '../your-code/block-scope';
import { InputStream } from "../your-language/input-stream";
import { LanguagePattern } from '../your-language/parsers/language-pattern';
import { FunctionDeclarationToken } from '../your-language/parsers/token/function/function-declaration-token';
import { VariableDeclarationToken } from '../your-language/parsers/token/variable/variable-declaration-token';

type StreamCallback<T> = (stream: CodeInputStream) => T

export class CodeInputStream extends InputStream {
    nextPattern: LanguagePattern;
    

    // FIXME: this isn't just a stream anymore
    // constructor(code: string,
    //             protected variables: BlockScope<VariableDeclarationToken>,
    //             protected functions: BlockScope<FunctionDeclarationToken>) {
    //     super(code);
    // }

    // getVariable(name: string) {
    //     return this.variables.get(name);
    // }

    // getFunction(name: string) {
    //     return this.functions.get(name);
    // }

    constructor(code: string) {
        super(code);
    }

    // tempScope<T>(variables: BlockScope<VariableDeclarationToken>, callback: StreamCallback<T>) {
    //     // swap the blockscope to current function scope
    //     const previously = this.variables;
    //     const parent = previously.parent;
    //     variables.setParent(parent);
    //     this.variables = variables;

    //     const result = callback(this);

    //     this.variables = previously;

    //     return result;
    // }

    checkNextPattern() {
        const nextPattern = this.nextPattern;
        this.nextPattern = null;
        const result = nextPattern?.checkFirstWorking(this);
        this.nextPattern = nextPattern;
        return result;
    }

    async tempNextPattern<T>(nextPattern: LanguagePattern, callback: StreamCallback<Promise<T>>) {
        // swap the blockscope to current function scope
        const previously = this.nextPattern;
        this.nextPattern = nextPattern;

        const result = await callback(this);

        this.nextPattern = previously;

        return result;
    }

    fail(message?: string) {
        return new Error(message);
    }
}