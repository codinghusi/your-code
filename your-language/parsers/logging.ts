
let ident = 0;

export function logIdent(message: string) {
    log(message);
    ident += 2;
}

export function log(message: string) {
    console.log(' '.repeat(ident) + message);
}

export function logUnident() {
    ident -= 2;
}