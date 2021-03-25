import { LanguageInputStream } from "../../../../language-input-stream";
import { NamingResult } from "../../result/namings/naming-result";
import { Parser } from "../../../parser";

export abstract class NamingParser<T extends NamingResult> extends Parser<T> {
    async parse(stream: LanguageInputStream) {
        return stream.testOut(async () => {
            return await super.parse(stream);
        });
    }
}
