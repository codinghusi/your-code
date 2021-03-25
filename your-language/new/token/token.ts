import { ParserResult } from "../parser-result";
import { TokenCapture } from "../../token-capture";

export class LanguageToken extends ParserResult {
    capture: TokenCapture;
    setCapture(capture: TokenCapture) {
        this.capture = capture;
        return this;
    }
}