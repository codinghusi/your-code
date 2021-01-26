import { InputStream } from "../../input-stream";
import { NameToken } from "../name-token";
import { Pattern } from "./pattern";

export class VariablePattern extends Pattern {
    constructor(public name: string) {
        super();
    }

    static parse(stream: InputStream) {
        if (stream.matchNextString('$', false)) {
            const result = NameToken.parse(stream);
            if (!result) {
                stream.croak(`after '$' a variable name must follow`);
            }
            const name = result.name;
            return new VariablePattern(name);
        }
        return null;
    }
}