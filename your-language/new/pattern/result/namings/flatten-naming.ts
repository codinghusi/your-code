import { NamingResult } from "./naming-result";

export class FlattenNaming extends NamingResult {
    onToResult(result: any) {
        return result;
    }
}

