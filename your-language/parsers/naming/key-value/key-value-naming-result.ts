import { Type } from "../../parser-result";
import { NamingResult } from "../naming-result";

// example: {mykey: 'myvalue'}
@Type("key-value-naming")
export class KeyValueNaming extends NamingResult {
    constructor(protected key: string,
                protected value: string) {
        super();
    }

    onToResult(result: any) {
        return { [this.key]: this.value };
    }
    
}