import { LanguageInputStream } from "../language-input-stream";
import { ParserResult } from "./parser-result";

export abstract class Parser<T extends ParserResult> {
    protected abstract parseIntern(stream: LanguageInputStream): Promise<T>;

    async parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = await this.parseIntern(stream);
        result?.setCapture(capture.finish());
        return result;
    }
}