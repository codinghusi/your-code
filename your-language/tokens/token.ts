import { TokenCapture } from "../token-capture";


export class Token {
    tokenCapture: TokenCapture;

    constructor(tokenCapture: TokenCapture) {
        this.tokenCapture = tokenCapture;
    }

    // toJSON() {
    //     const obj = Object.entries(this).reduce((acc, [key, value]) => {
    //         if (typeof(value) === "function") {
    //             return acc;
    //         }
    //         acc[key] = value;
    //         return acc;
    //     }, {}) as any;
    //     delete obj.tokenCapture;
    //     return JSON.stringify(obj);
    // }
}