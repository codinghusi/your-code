import { InputStream } from "../../input-stream";
import { NameToken } from "../name-token";
import { StringPattern } from "./string-pattern";


export abstract class Naming {
    abstract onToResult(result: any): any;
}

export class KeyValueNaming extends Naming {
    constructor(protected key: string,
                protected value: string) {
        super();
    }

    static parse(stream: InputStream) {
        return stream.testOut(() => {
            let key, value;
            const worked = stream.matchNextString('{') &&
                (key = NameToken.parse(stream)?.name) &&
                stream.matchNextString(':') &&
                (value = StringPattern.parse(stream)?.value) &&
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

    static parse(stream: InputStream) {
        return stream.testOut(() => {
            let key;
            const worked = stream.matchNextString('{') &&
                (key = NameToken.parse(stream)?.name) &&
                stream.matchNextString('}');
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
    static parse(stream: InputStream) {
        return stream.testOut(() => {
            const worked = stream.matchNextString('{') && stream.matchNextString('}');
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
    ]

    constructor(protected namings: Naming[]) { }

    onToResult(result: any) {
        return this.namings.reduce((finished, naming) => ({ ...finished, ...naming.onToResult(result) }));
    }

    static parse(stream: InputStream) {
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

        return namings;
    }
}