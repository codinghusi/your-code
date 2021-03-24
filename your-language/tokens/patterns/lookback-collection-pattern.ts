import { Pattern, Type } from './pattern';
import { LookbackMatchingPattern } from './lookback-matching-pattern';
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { LanguageInputStream } from '../../language-input-stream';
import { TokenCapture } from '../../token-capture';


@Type("lookback-collection")
export class LookbackCollectionPattern extends Pattern {
    protected worked = true;

    constructor(capture: TokenCapture,
                protected patterns: Pattern[],
                protected parent?: LookbackCollectionPattern) {
        super(capture);
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
        const capture = stream.startCapture();
        const list = this.parseList(stream);
        return new LookbackCollectionPattern(capture.finish(), list);
    }

    parse(stream: CodeInputStream) {
        return this.patterns.every(lookback => !!lookback.parse(stream));
    }
    
    checkFirstWorking(stream: CodeInputStream): boolean {
        return !!this.patterns[0]?.parse(stream);
    }

    setParent(parent: LookbackCollectionPattern) {
        this.parent = parent;
        return this;
    }

    getParent() {
        return this.parent;
    }

    test(stream: CodeInputStream) {
        const self = this;
        const myCheck = stream.testOut(() => self.patterns.every(lookback => lookback.parse(stream)));
        this.worked = myCheck && this.parent?.test(stream);
        return this.worked;
    }

    works() {
        return this.worked;
    }
}