import { FunctionDeclarationToken } from './tokens/function-declaration-token';
import { VariableDeclarationToken } from './tokens/variable-declaration-token';

interface Named {
    name: string;
}

export class Collection<T extends Named> extends Map<string, T>{
    constructor(variables?: T[]) {
        super(variables?.map(variable => ([variable.name, variable])));
    }

    map() {
        return Object.fromEntries(this.entries());
    }
}

export class VariableCollection extends Collection<VariableDeclarationToken> { }
export class FunctionCollection extends Collection<FunctionDeclarationToken> { }