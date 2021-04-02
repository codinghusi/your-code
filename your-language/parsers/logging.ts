
let ident = 0;

export function logIdent(message: string) {
    console.log(' '.repeat(ident) + message);
    ident += 2;
}

export function logUnident() {
    ident -= 2;
}