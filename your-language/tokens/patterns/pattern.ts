import { Namings } from "./namings";
import { LookbackMatchingPattern } from './lookback-matching-pattern';
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { PatternFail } from "./pattern-fail";
import { SeparatorPattern } from './separator-pattern';


export abstract class Pattern {
    protected namings: Namings;
    protected lookbacks: LookbackMatchingPattern[];
    public lastError: PatternFail;
    public separatorBefore: SeparatorPattern;

    setNamings(namings: Namings) {
        this.namings = namings;
        return this;
    }

    getNamings() {
        return this.namings;
    }

    setSeparator(separator: SeparatorPattern) {
        this.separatorBefore = separator;
        return this;
    }

    setLookbacks(lookbacks: LookbackMatchingPattern[]) {
        this.lookbacks = lookbacks;
        return this;
    }

    // Iterator for multiple parsing choices (one next() gives one option (not one parsed pattern))
    abstract parse(stream: CodeInputStream): Generator<any> | any;

    softParse(stream: CodeInputStream) {
        return stream.testOut(() => {
            try {
               return this.parse(stream);
            } catch(fail) {
                this.lastError = fail;
                return null;
            }
        });
    }

    abstract checkFirstWorking(stream: CodeInputStream): boolean;

}