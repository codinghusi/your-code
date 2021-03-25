import { LanguageInputStream } from "../../language-input-stream";
import { LanguagePattern } from "./pattern";

export abstract class LanguageParser<T extends LanguagePattern> {
    protected abstract parseIntern(stream: LanguageInputStream): Promise<T>;

    async parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        const result = await this.parseIntern(stream);
        result.setCapture(capture.finish());
        return result;
    }
}