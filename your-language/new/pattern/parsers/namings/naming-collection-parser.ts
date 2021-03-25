import { LanguageInputStream } from "../../../../language-input-stream";
import { NamingCollection } from "../../result/namings/naming-collection";
import { NamingParser } from "./naming-parser";
import { Namings } from "./all-namings";
import { NamingResult } from "../../result/namings/naming-result";

export class NamingCollectionParser extends NamingParser<NamingCollection> {
    parsers = [
        Namings.key,
        Namings.flatten,
        Namings.keyValue,
    ];

    async parseIntern(stream: LanguageInputStream) {
        const namings: NamingResult[] = [];
        let worked = true;

        // collect as many namings as possible
        while (worked) {
            worked = false;

            // test for all possible namings
            for (const parser of this.parsers) {
                const naming = await parser(stream);
                if (naming) {
                    namings.push(naming);
                    worked = true;
                    break;
                }
            }
        }

        if (!namings.length) {
            return null;
        }
        
        return new NamingCollection(namings);
    }
}