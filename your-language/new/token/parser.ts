import { LanguageInputStream } from "../../language-input-stream";
import { LanguageToken } from "./token";
import { Parser } from "../parser";

export function bindMapParserContexts(destination: any, contexts: any) {
    for (const key in destination) {
        const parser = destination[key];
        const context = contexts[key];
        destination[key] = parser.bind(context);
    }
}

export abstract class LanguageTokenParser<T extends LanguageToken> extends Parser<T> {
}