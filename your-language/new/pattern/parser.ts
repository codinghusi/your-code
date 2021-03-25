import { Parser } from "../parser";
import { LanguagePattern } from "./pattern";

export abstract class LanguageParser<T extends LanguagePattern> extends Parser<T>{
}