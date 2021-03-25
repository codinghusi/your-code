import * as fs from 'fs';
import { DefinitionToken } from './parsers/token/definition/definition-token';
import { FunctionDeclarationToken } from './parsers/token/function/function-declaration-token';
import { VariableDeclarationToken } from './parsers/token/variable/variable-declaration-token';

interface KeyValue<TValue> {
    [key: string]: TValue;
}

export type Definitions = KeyValue<DefinitionToken[]>;
export type Functions = KeyValue<FunctionDeclarationToken>;
export type Variables = KeyValue<VariableDeclarationToken>;

export type Declaration = DefinitionToken | FunctionDeclarationToken | VariableDeclarationToken;

export class Language {
    constructor(public definitions: Definitions,
                public functions: Functions,
                public globalVariables: Variables) {}

    async saveAsJSON(path: string) {
        const json = JSON.stringify(this, null, 2);
        fs.writeFileSync(path, json);
    }
}