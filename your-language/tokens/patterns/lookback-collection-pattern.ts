import { Pattern } from './pattern';
import { LookbackMatchingPattern } from './lookback-matching-pattern';
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { LanguageInputStream } from '../../language-input-stream';

interface Params {
    lookbacks: Pattern[];
    parent?: LookbackCollection;
}

export class LookbackCollection {
    protected worked = true;
    protected lookbacks: Pattern[];
    protected parent?: LookbackCollection;

    constructor(params: Params) {
        Object.assign(this, params);
    }

    static parseList(stream: LanguageInputStream) {
        let lookback: Pattern;
        const lookbacks: Pattern[] = [];

        while (lookback = LookbackMatchingPattern.parse(stream)) {
            lookbacks.push(lookback);
        }

        return lookbacks;
    }

    static parse(stream: LanguageInputStream) {
        return new LookbackCollection({ lookbacks: this.parseList(stream) });
    }

    setParent(parent: LookbackCollection) {
        this.parent = parent;
        return this;
    }

    getParent() {
        return this.parent;
    }

    test(stream: CodeInputStream) {
        const self = this;
        const myCheck = stream.testOut(() => self.lookbacks.every(lookback => lookback.parse(stream)));
        this.worked = myCheck && this.parent?.test(stream);
        return this.worked;
    }

    works() {
        return this.worked;
    }
}