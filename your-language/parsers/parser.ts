import { LanguageInputStream } from "../language-input-stream";
import { ParserResult } from "./parser-result";

export function ParserType(name: string) {
    return (constructor: Function) => {
        Reflect.defineMetadata(Parser.typeSymbol, name, constructor);
        Parser.parsers[name] = constructor;
    };
}


export abstract class Parser<T extends ParserResult> {
    static parsers = {};
    static typeSymbol = Symbol("parser-type");

    static parserByType(type: string) {
        return this.parsers[type];
    }

    get type() {
        return Reflect.getMetadata(Parser.typeSymbol, this.constructor);
    }

    getParserResult() {
        return ParserResult.resultByType(this.type);
    }

    protected abstract parseIntern(stream: LanguageInputStream): Promise<T>;

    async parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = await this.parseIntern(stream);
        result?.setCapture(capture.finish());
        return result;
    }
}