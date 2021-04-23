import { AlreadyVisitedError } from './../../your-parser/errors/already-visited-error';
import { CodeInputStream } from './../../your-parser/code-input-stream';
import { FunctionPattern } from './pattern/function/function-pattern';
import "reflect-metadata";
import { ParserResult } from "./parser-result";
import { NamingCollection } from "./naming/collection/naming-collection-result";
import { LookbackMatchingPattern } from "./pattern/lookback/lookback-matching-pattern";
import { SeparatorPattern } from "./pattern/separator/separator-pattern";
import { log, logIdent, logUnident } from "./logging";
import { VariablePattern } from './pattern/variable/variable-pattern';

let ident = 0;

export abstract class LanguagePattern extends ParserResult {
    protected namings: NamingCollection = new NamingCollection([]);
    protected lookbacks: LookbackMatchingPattern[];
    lastError: Error;
    separatorBefore: SeparatorPattern;
    visitedPosition: number;

    constructor() {
        super();
        const self = this;
        Promise.resolve().then(() => {
            const oldParse = self.parse;
            self.parse = async (...args: Parameters<typeof oldParse>) => {
                logIdent("> " + self.type + " " + self);
                let result: ReturnType<typeof oldParse>;
                try {
                    result = await oldParse.call(self, ...args);
                    if (result) {
                        log("= " + JSON.stringify(result));
                    }
                } catch(e) { }
                if (!result) {
                    log("# error");
                }
                logUnident();
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
    abstract parseIntern(stream: CodeInputStream): Promise<Generator<any> | any>;

    async parse(stream: CodeInputStream) {
        if (this.visitedPosition == stream.position) {
            throw new AlreadyVisitedError(stream);
        }
        this.visitedPosition = stream.position;
        return this.namings?.onToResult(this.parseIntern(stream));
    }

    abstract checkFirstWorking(stream: CodeInputStream): Promise<boolean>;

    abstract collectVariablesAndFunctions(): (VariablePattern | FunctionPattern)[]

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