import { NamingResult } from "./naming-result";

export class NamingCollection extends NamingResult {
    constructor(protected namings: NamingResult[]) {
        super();
    }

    onToResult(result: any, keepResultAsDefault = false) {
        if (this.available() || !keepResultAsDefault) {
            return this.namings.reduce((finished, naming) => ({ ...finished, ...naming.onToResult(result) }));
        }
        return result;
    }

    available() {
        return this.namings.length > 0;
    }

}