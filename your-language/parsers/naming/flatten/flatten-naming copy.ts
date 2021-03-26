import { PatternType } from "../../parser-result";
import { NamingResult } from "../naming-result";

@PatternType("flatten-naming")
export class FlattenNaming extends NamingResult {
    onToResult(result: any) {
        return result;
    }
}

