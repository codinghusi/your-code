import { CodeInputStream } from "../../your-parser/code-input-stream";
import { TokenCapture } from "../token-capture";
import { Namings } from "../tokens/patterns/namings";
import { LookbackMatchingPattern } from "./patterns/lookback-matching-pattern";
import { SeparatorPattern } from "./patterns/separator-pattern";

const patterns = {};
const typeSymbol = Symbol("pattern-type");

export function Type(name: string) {
    return (constructor: Function) => {
        Reflect.defineMetadata(typeSymbol, name, constructor);
        patterns[name] = constructor;
    };
}

export abstract class LanguagePattern {
    protected namings: Namings;
    protected lookbacks: LookbackMatchingPattern[];
    capture: TokenCapture;
    lastError: Error;
    separatorBefore: SeparatorPattern;

    setCapture(capture: TokenCapture) {
        this.capture = capture;
        return this;
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