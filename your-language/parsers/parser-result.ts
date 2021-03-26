import { TokenCapture } from "../token-capture";

const patterns = {};
const typeSymbol = Symbol("pattern-type");

export function PatternType(name: string) {
    return (constructor: Function) => {
        Reflect.defineMetadata(typeSymbol, name, constructor);
        patterns[name] = constructor;
    };
}


export abstract class ParserResult {
    tokenCapture: TokenCapture;
    
    setCapture(capture: TokenCapture) {
        this.tokenCapture = capture;
        return this;
    }

    get type() {
        return Reflect.getMetadata(typeSymbol, this.constructor);
    }

    toJSON() {
        const data = { type: this.type, ...this };
        return data;
    }
}