import { Type } from "../../../parser-result";
import { NamingResult } from "./naming-result";

@Type("key-naming")
export class KeyNaming extends NamingResult {
    constructor(protected key: string) {
        super();
    }

    onToResult(result: any) {
        return { [this.key]: result };
    }
}