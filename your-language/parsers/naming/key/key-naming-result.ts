import { ResultType } from "../../parser-result";
import { NamingResult } from "../naming-result";


@ResultType("key-naming")
export class KeyNaming extends NamingResult {
    constructor(protected key: string) {
        super();
    }

    toString() {
        return `{${this.key}}`;
    }

    onToResult(result: any) {
        return { [this.key]: result };
    }
}