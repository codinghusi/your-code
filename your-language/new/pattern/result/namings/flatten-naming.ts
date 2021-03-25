import { Type } from "../../../parser-result";
import { NamingResult } from "./naming-result";

@Type("flatten-naming")
export class FlattenNaming extends NamingResult {
    onToResult(result: any) {
        return result;
    }
}

