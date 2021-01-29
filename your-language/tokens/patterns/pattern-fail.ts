

export class PatternFail extends Error {
    static assert(value: any, message?: string) {
        if (!value) {
            throw new PatternFail(message);
        }
    }
}