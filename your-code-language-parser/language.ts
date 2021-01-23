import * as fs from 'fs';
import { DefinitionItem, FunctionDeclarationItem, PatternItem, VariableDeclarationItem } from './parser';
import { IdentifierToken, StringToken } from './token-input-stream';

interface KeyValue<T> {
    [key: string]: T;
}

export type LanguageDefinitionsValue = StringToken | IdentifierToken;
export type LanguageFunctionsValue = { variables: LanguageVariables, pattern: PatternItem[] };
export type LanguageVariablesValue = PatternItem[];

export type LanguageDefinitions = KeyValue<LanguageDefinitionsValue>;
export type LanguageFunctions = KeyValue<LanguageFunctionsValue>;
export type LanguageVariables = KeyValue<LanguageVariablesValue>;

export class Language {
    constructor(public definitions: LanguageDefinitions,
                public functions: LanguageFunctions,
                public globalVariables: LanguageVariables) {}

    async saveAsJSON(path: string) {
        const json = JSON.stringify({
            ast: this.definitions
        });
        fs.writeFileSync(path, json);
    }
}