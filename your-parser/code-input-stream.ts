import { VariableCollection, FunctionCollection } from '../your-language/collections';
import { InputStream } from "../your-language/input-stream";
import { LookbackCollection } from '../your-language/tokens/patterns/lookback-collection-pattern';
import { Pattern } from '../your-language/tokens/patterns/pattern';
import { PatternFail } from '../your-language/tokens/patterns/pattern-fail';
import { BlockScope } from '../your-code/block-scope';
import { VariableDeclarationToken } from '../your-language/tokens/variable-declaration-token';
import { FunctionDeclarationToken } from '../your-language/tokens/function-declaration-token';
import { VariableDeclarationItem } from '../your-language/pre-parser';

type StreamCallback<T> = (stream: CodeInputStream) => T

export class CodeInputStream extends InputStream {
    lookbacks: LookbackCollection;
    nextPattern: Pattern;
    

    // FIXME: this isn't just a stream anymore
    constructor(code: string,
                protected variables: BlockScope<VariableDeclarationToken>,
                protected functions: BlockScope<FunctionDeclarationToken>) {
        super(code);
    }

    getVariable(name: string) {
        return this.variables.get(name);
    }

    getFunction(name: string) {
        return this.functions.get(name);
    }

    tempScope<T>(variables: BlockScope<VariableDeclarationToken>, callback: StreamCallback<T>) {
        // swap the blockscope to current function scope
        const previously = this.variables;
        const parent = previously.parent;
        variables.setParent(parent);
        this.variables = variables;


        this.variables = previously;
    }

    setNextPattern(nextPattern: Pattern) {
        this.nextPattern = nextPattern;
        return this;
    }

    resetNextPattern() {
        this.setNextPattern(null);
    }

    checkNextPattern() {
        const nextPattern = this.nextPattern;
        this.resetNextPattern();
        const result = nextPattern?.checkFirstWorking(this);
        this.setNextPattern(nextPattern);
        return result;
    }

    testLookback() {
        this.lookbacks?.test(this);
        return this;
    }

    useLookbacks<T>(lookbacks: LookbackCollection, callback: StreamCallback<T>) {
        // push lookbacks
        const parent = this.lookbacks;
        lookbacks.setParent(parent);
        this.lookbacks = lookbacks;

        // use callback
        const result = callback(this);
        
        // pop lookbacks
        this.lookbacks = parent;

        // return the result
        return result;
    }

    doesLookbackWork() {
        return this.lookbacks?.works();
    }

    fail(message?: string) {
        return new PatternFail(message);
    }
}