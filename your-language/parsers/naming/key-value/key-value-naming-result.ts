import { ResultType } from "../../parser-result";
import { NamingResult } from "../naming-result";

// example: {mykey: 'myvalue'}
@ResultType("key-value-naming")
export class KeyValueNaming extends NamingResult {
    constructor(protected key: string,
                protected value: string) {
        super();
    }

    toString() {
        return `{${this.key}: '${this.value}'}`;
    }

    onToResult(result: any) {
        return { [this.key]: this.value };
    }
    
}