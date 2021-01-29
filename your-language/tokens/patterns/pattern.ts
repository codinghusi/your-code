import { Namings } from "./namings";
import { LookbackMatchingPattern } from './lookback-matching-pattern';
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { PatternFail } from "./pattern-fail";


export abstract class Pattern {
    protected namings: Namings;
    protected lookbacks: LookbackMatchingPattern[];
    public lastError: PatternFail;

    setNamings(namings: Namings) {
        this.namings = namings;
        return this;
    }

    getNamings() {
        return this.namings;
    }

    setLookbacks(lookbacks: LookbackMatchingPattern[]) {
        this.lookbacks = lookbacks;
        return this;
    }

    // Iterator for multiple parsing choices (one next() gives one option (not one parsed pattern))
    abstract _parse(stream: CodeInputStream): Generator<any> | any;

    protected * iteratorParse(stream: CodeInputStream) {
        const result = this._parse(stream);
        if ('next' in result && 'done' in result) {
            yield *result;
        }
        yield result;
    }

    parse(stream: CodeInputStream) {
        const iterator = this.iteratorParse(stream);
        return iterator.next().value;
    }

    softParse(stream: CodeInputStream) {
        try {
           return this.parse(stream);
        } catch(fail) {
            this.lastError = fail;
            return null;
        }
    }

    abstract checkFirstWorking(stream: CodeInputStream): boolean;

}