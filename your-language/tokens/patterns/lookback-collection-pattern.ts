import { Pattern } from './pattern';
import { LookbackMatchingPattern } from './lookback-matching-pattern';
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { LanguageInputStream } from '../language-input-stream';


export class LookbackCollection {
    protected worked = true;

    constructor(protected lookbacks: Pattern[],
                protected parent?: LookbackCollection) { }

    static parseList(stream: LanguageInputStream) {
        let lookback: Pattern;
        const lookbacks: Pattern[] = [];

        while (lookback = LookbackMatchingPattern.parse(stream)) {
            lookbacks.push(lookback);
        }

        return lookbacks;
    }

    static parse(stream: LanguageInputStream) {
        return new LookbackCollection(this.parseList(stream));
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
        const myCheck = stream.testOut(() => self.lookbacks.every(lookback => lookback._parse(stream)));
        this.worked = myCheck && this.parent?.test(stream);
        return this.worked;
    }

    works() {
        return this.worked;
    }
}