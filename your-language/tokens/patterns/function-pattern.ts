import { InputStream } from "../../input-stream";
import { NameToken } from "../name-token";
import { Pattern } from "./pattern";


export class FunctionPattern extends Pattern {
    constructor(public name: string) {
        super();
    }

    static parse(stream: InputStream) {
        const result = NameToken.parse(stream);
        if (result) {
            const name = result.name;
            return new FunctionPattern(name);
        }
        return null;
    }
}