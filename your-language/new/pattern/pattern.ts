import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LookbackMatchingPattern } from "./patterns/lookback-matching-pattern";
import { NamingCollection } from "./result/namings/naming-collection";
import { NamingCollectionParser } from "./parsers/namings/naming-collection-parser";
import { SeparatorPattern } from "./patterns/separator-pattern";
import { TokenCapture } from "../../token-capture";

const patterns = {};
const typeSymbol = Symbol("pattern-type");

export function Type(name: string) {
    return (constructor: Function) => {
        Reflect.defineMetadata(typeSymbol, name, constructor);
        patterns[name] = constructor;
    };
}

export abstract class LanguagePattern {
    protected namings: NamingCollection;
    protected lookbacks: LookbackMatchingPattern[];
    tokenCapture: TokenCapture;
    lastError: Error;
    separatorBefore: SeparatorPattern;

    setCapture(capture: TokenCapture) {
        this.tokenCapture = capture;
        return this;
    }


    setNamings(namings: NamingCollection) {
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