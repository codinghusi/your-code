import { TokenCapture } from "../token-capture";

export function ResultType(name: string) {
    return (constructor: Function) => {
        Reflect.defineMetadata(ParserResult.typeSymbol, name, constructor);
        ParserResult.results[name] = constructor;
    };
}


export abstract class ParserResult {
    static results = {};
    static typeSymbol = Symbol("result-type");
    
    tokenCapture: TokenCapture;
    
    static resultByType(type: string) {
        return this.results[type];
    }

    setCapture(capture: TokenCapture) {
        this.tokenCapture = capture;
        return this;
    }

    get type() {
        return Reflect.getMetadata(ParserResult.typeSymbol, this.constructor);
    }

    toJSON() {
        const data = { type: this.type, ...this };
        return data;
    }
}