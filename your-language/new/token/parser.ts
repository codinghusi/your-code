import { LanguageInputStream } from "../../language-input-stream";
import { LanguageToken } from "./token";
import { Parser } from "../parser";

export abstract class LanguageTokenParser<T extends LanguageToken> extends Parser<T> {
    protected abstract parseIntern(stream: LanguageInputStream): Promise<T>;

    async parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = await this.parseIntern(stream);
        result.setCapture(capture.finish());
        return result;
    }
}