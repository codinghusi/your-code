import { LanguageInputStream } from "../language-input-stream";
import { NameToken } from "./name-token";
import { ParserPattern } from "./patterns/parser-pattern";
import { Token } from "./token";

interface Params {
    name: string;
    isConstant: boolean;
    parser: ParserPattern;
}

export class VariableDeclarationToken extends Token {
    name: string;
    isConstant: boolean;
    parser: ParserPattern;

    constructor(params: Params) {
        super();
        Object.assign(this, params);
    }

    static parse(stream: LanguageInputStream) {
        if (stream.matchNextString('#')) {
            if (stream.hasWhitespace()) {
                stream.croak(`you aren't allowed to put whitespace here`);
            }
            const isConstant = !!stream.matchNextString('!');
            if (stream.hasWhitespace()) {
                stream.croak(`you aren't allowed to put whitespace here`);
            }
            const result = NameToken.parse(stream);
            if (!result) {
                stream.croak(`after a # must follow a variable declaration`);
            }
            if (!stream.matchWhitespace()) {
                stream.croak(`please leave a gap between variable name and the value`);
            }
            const name = result.name;
            const parser = ParserPattern.parse(stream);
            if (!parser) {
                stream.croak(`you need to define a parser as the variable value`);
            }
            return new VariableDeclarationToken({ name, isConstant, parser });
        }
        return null;
    }
}
