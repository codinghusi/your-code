import { TokenCapture } from "../token-capture";

export abstract class ParserResult {
    tokenCapture: TokenCapture;
    
    setCapture(capture: TokenCapture) {
        this.tokenCapture = capture;
        return this;
    }
}