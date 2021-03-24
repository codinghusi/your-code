import { DefinitionToken } from './tokens/definition-token';
import { FunctionDeclarationToken } from './tokens/function-declaration-token';
import { VariableDeclarationToken } from './tokens/variable-declaration-token';
import * as fs from 'fs';

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