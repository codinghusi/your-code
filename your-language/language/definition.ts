import { convertToMap } from "./utils";


export class LanguageDefinition {
    constructor(public name: string,
                public value: any) { }

    static fromRaw(raw: any) {
        return convertToMap(raw, ({ name, value }) => ({ name, value }));
    }
}