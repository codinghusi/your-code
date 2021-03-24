import { Namings } from "./namings";
import { LookbackMatchingPattern } from './lookback-matching-pattern';
import { CodeInputStream } from '../../../your-parser/code-input-stream';
import { PatternFail } from "./pattern-fail";
import { SeparatorPattern } from './separator-pattern';
import { Token } from "../token";
import "reflect-metadata";
import { TokenCapture } from "../../token-capture";

const patterns = {};
const typeSymbol = Symbol("pattern-type");

export function Type(name: string) {
    return (constructor: Function) => {
        Reflect.defineMetadata(typeSymbol, name, constructor);
        patterns[name] = constructor;
    };
}

export abstract class Pattern extends Token {
    protected namings: Namings;
    protected lookbacks: LookbackMatchingPattern[];
    public lastError: PatternFail;
    public separatorBefore: SeparatorPattern;
    public type: string;

    constructor(capture: TokenCapture) {
        super(capture);
        this.type = Reflect.getMetadata(typeSymbol, this.constructor);
    }

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