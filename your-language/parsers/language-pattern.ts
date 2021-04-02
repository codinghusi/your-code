import "reflect-metadata";
import { CodeInputStream } from "../../your-parser/code-input-stream";
import { ParserResult } from "./parser-result";
import { NamingCollection } from "./naming/collection/naming-collection-result";
import { LookbackMatchingPattern } from "./pattern/lookback/lookback-matching-pattern";
import { SeparatorPattern } from "./pattern/separator/separator-pattern";

let ident = 0;

export abstract class LanguagePattern extends ParserResult {
    protected namings: NamingCollection = new NamingCollection([]);
    protected lookbacks: LookbackMatchingPattern[];
    lastError: Error;
    separatorBefore: SeparatorPattern;

    constructor() {
        super();
        const self = this;
        Promise.resolve().then(() => {
            const oldParse = self.parse;
            self.parse = async (...args: Parameters<typeof oldParse>) => {
                if (ident < 50)
                    console.log(' '.repeat(ident) + "> " + self.type + " " + self);
                else 
                    return new Promise(() => {}); // halt
                ident += 2;
                const result = await oldParse.call(self, ...args);
                if (!result) {
                    console.log("failed");
                }
                console.log("yoyoyoyoyo");
                ident -= 2;
                return result;
            }
        })
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
    abstract parse(stream: CodeInputStream): Promise<Generator<any> | any>;

    abstract checkFirstWorking(stream: CodeInputStream): Promise<boolean>;

    async softParse(stream: CodeInputStream) {
        return await stream.testOut(async () => {
            try {
               return await this.parse(stream);
            } catch(fail) {
                this.lastError = fail;
                return null;
            }
        });
    }
}