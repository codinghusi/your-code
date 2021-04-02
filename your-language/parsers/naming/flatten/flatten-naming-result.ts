import { ResultType } from "../../parser-result";
import { NamingResult } from "../naming-result";

@ResultType("flatten-naming")
export class FlattenNaming extends NamingResult {
    onToResult(result: any) {
        return result;
    }

    toString() {
        return "{}";
    }
}

