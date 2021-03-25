import { ParserResult } from "../../../parser-result";

export abstract class NamingResult extends ParserResult {
    abstract onToResult(result: any): any;
}