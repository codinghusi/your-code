import 'reflect-metadata';
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

interface Params {
    definitions: Definitions;
    functions: Functions;
    globalVariables: Variables;
}

export class Language {
    definitions: Definitions;
    functions: Functions;
    globalVariables: Variables;

    constructor(params: Params) {
        Object.assign(this, params);
    }

    async saveAsJSON(path: string) {
        const cache = []; // because circular dependencies
        const json = JSON.stringify({
            definitions: this.definitions,
            functions: this.functions,
            globalVariables: this.globalVariables
        }, (key, value) => {
            if (value && typeof(value) === "object") {
                if (cache.includes(value)) {
                    return "[circular]";
                }
                cache.push(value);
            }
            return value;
        }, 2);
        fs.writeFileSync(path, json);
    }
}