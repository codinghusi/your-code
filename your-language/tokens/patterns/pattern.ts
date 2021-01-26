import { Namings } from "./naming";


export class Pattern {
    protected namings: Namings;

    setNamings(namings: Namings) {
        this.namings = namings;
        return this;
    }
}