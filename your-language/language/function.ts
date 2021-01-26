import { convertToMap } from "./utils";


export class LanguageFunction {
    constructor(public name: string,
                public variables: any,
                public pattern: any) { }

    static fromRaw(raw: any) {
        return convertToMap(raw, ({ name, value }) => ({ name, value }));
    }
}