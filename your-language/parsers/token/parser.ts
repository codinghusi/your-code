import { Parser } from "../parser";
import { LanguageToken } from "./token";

export function bindMapParserContexts(destination: any, contexts: any) {
    for (const key in destination) {
        const parser = destination[key];
        const context = contexts[key];
        destination[key] = parser.bind(context);
    }
}

export abstract class LanguageTokenParser<T extends LanguageToken> extends Parser<T> {
}