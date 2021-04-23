import { CodeError } from "./code-error";


export class PropagateError extends CodeError {
    constructor(public errors: CodeError[]) {
        super(`errors: \n ${errors.map(error => error.message).join('\n ')}`);
    }
}