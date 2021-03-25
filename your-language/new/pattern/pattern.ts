import { CodeInputStream } from "../../../your-parser/code-input-stream";
import { LookbackMatchingPattern } from "./patterns/lookback-matching-pattern";
import { NamingCollection } from "./result/namings/naming-collection";
import { SeparatorPattern } from "./patterns/separator-pattern";
import "reflect-metadata";
import { ParserResult } from "../parser-result";


export abstract class LanguagePattern extends ParserResult {
    protected namings: NamingCollection;
    protected lookbacks: LookbackMatchingPattern[];
    lastError: Error;
    separatorBefore: SeparatorPattern;

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