import { NamingResult } from "./naming-result";

export class KeyNaming extends NamingResult {
    constructor(protected key: string) {
        super();
    }

    onToResult(result: any) {
        return { [this.key]: result };
    }
}