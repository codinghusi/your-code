import { InputStream } from "../your-code-language-parser/input-stream";
import { LanguageVariableValue } from "../your-code-language-parser/language";
import { BlockScope } from "./block-scope";

export class LookbackChecker {
    protected _result = true;
    protected lookbacks: (() => boolean)[];
    protected varScope: BlockScope<LanguageVariableValue>;

    constructor(protected stream: InputStream) {}

    set(lookbacks: (() => boolean)[], varScope: BlockScope<LanguageVariableValue>) {
        this.lookbacks = lookbacks;
        this.varScope = varScope;
        return this;
    }

    reset() {
        this.lookbacks = [];
        this.check();
        return this;
    }

    check() {
        this.stream.pushCheckPoint();
        this._result = this.lookbacks.every(lb => lb());
        this.stream.popCheckPoint();
        return this;
    }

    result() {
        return this._result;
    }
}