import { convertToMap } from "./utils";

export class LanguageVariable {
    constructor(public name: string,
                public pattern: any) { }

    static fromRaw(raw: any) {
        return convertToMap(raw, ({ name, pattern }) => ({ name, value: pattern }));
    }
}