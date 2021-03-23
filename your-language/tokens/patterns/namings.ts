import { LanguageInputStream } from "../../language-input-stream";
import { NameToken } from "../name-token";
import { StringPattern } from "./string-pattern";


export abstract class Naming {
    abstract onToResult(result: any): any;
}

// example: {mykey: 'myvalue'}
export class KeyValueNaming extends Naming {
    constructor(protected key: string,
                protected value: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        return stream.testOut(() => {
            let key: string, value: string;
            const worked = stream.matchNextString('{') &&
                (stream.matchWhitespace(), key = NameToken.parse(stream)?.name) &&
                (stream.matchWhitespace(), stream.matchNextString(':')) &&
                (stream.matchWhitespace(), value = StringPattern.parse(stream)?.value) &&
                stream.matchNextString('}');
            if (!worked) {
                return null;
            }
            return new KeyValueNaming(key, value);
        });
    }

    onToResult(result: any) {
        return { [this.key]: this.value };
    }
    
}

export class KeyNaming extends Naming {
    constructor(protected key: string) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        return stream.testOut(() => {
            let key: string;
            const worked = stream.matchNextString('{') &&
                (stream.matchWhitespace(), key = NameToken.parse(stream)?.name) &&
                (stream.matchWhitespace(), stream.matchNextString('}'));
            if (!worked) {
                return null;
            }
            return new KeyNaming(key);
        });
    }

    onToResult(result: any) {
        return { [this.key]: result };
    }
}

export class FlattenNaming extends Naming {
    static parse(stream: LanguageInputStream) {
        return stream.testOut(() => {
            const worked = stream.matchNextString('{') && (stream.matchWhitespace(), stream.matchNextString('}'));
            if (!worked) {
                return null;
            }
            return new FlattenNaming();
        });
    }

    onToResult(result: any) {
        return result;
    }
}

export class Namings {
    static parsers = [
        KeyNaming.parse,
        FlattenNaming.parse,
        KeyValueNaming.parse,
    ];

    constructor(protected namings: Naming[]) { }

    onToResult(result: any, keepResultAsDefault = false) {
        if (this.available() || !keepResultAsDefault) {
            return this.namings.reduce((finished, naming) => ({ ...finished, ...naming.onToResult(result) }));
        }
        return result;
    }

    available() {
        return this.namings.length > 0;
    }

    static parse(stream: LanguageInputStream) {
        const namings = [];
        let worked = true;

        // collect as many namings as possible
        while (worked) {
            worked = false;

            // test for all possible namings
            for (const parser of this.parsers) {
                const naming = parser(stream);
                if (naming) {
                    namings.push(naming);
                    worked = true;
                    break;
                }
            }
        }

        return new Namings(namings);
    }
}