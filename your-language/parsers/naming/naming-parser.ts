import { LanguageInputStream } from "../../language-input-stream";
import { Parser } from "../parser";
import { NamingResult } from "./naming-result";

export abstract class NamingParser<T extends NamingResult> extends Parser<T> {
    async parse(stream: LanguageInputStream) {
        return stream.testOut(async () => {
            return await super.parse(stream);
        });
    }
}
