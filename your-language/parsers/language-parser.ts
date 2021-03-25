import { LanguagePattern } from "./language-pattern";
import { Parser } from "./parser";

export abstract class LanguageParser<T extends LanguagePattern> extends Parser<T>{
}