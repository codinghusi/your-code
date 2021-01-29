import * as fs from '../your-parser/node_modules/fs';
import { DefinitionItem, FunctionDeclarationItem, PatternItem, VariableDeclarationItem } from './pre-parser';
import { IdentifierToken, StringToken } from './token-input-stream';

interface KeyValue<T> {
    [key: string]: T;
}

export type LanguageRawDefinitionValue = StringToken | IdentifierToken;
export type LanguageDefinitionValue = String | LanguageFunctionValue;
export type LanguageFunctionValue = { name: string, variables: LanguageVariables, pattern: PatternItem[] };
export type LanguageVariableValue = PatternItem[];

export type LanguageRawDefinitions = KeyValue<LanguageRawDefinitionValue>;
export type LanguageFunctions = KeyValue<LanguageFunctionValue>;
export type LanguageVariables = KeyValue<LanguageVariableValue>;

export class Language {
    constructor(public definitions: LanguageRawDefinitions,
                public functions: LanguageFunctions,
                public globalVariables: LanguageVariables) {}

    async saveAsJSON(path: string) {
        const json = JSON.stringify({
            ast: this.definitions
        });
        fs.writeFileSync(path, json);
    }
}