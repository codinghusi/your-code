import { NamingResult } from "./naming-result";

// example: {mykey: 'myvalue'}
export class KeyValueNaming extends NamingResult {
    constructor(protected key: string,
                protected value: string) {
        super();
    }

    onToResult(result: any) {
        return { [this.key]: this.value };
    }
    
}