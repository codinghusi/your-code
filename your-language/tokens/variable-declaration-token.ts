import { LanguageInputStream } from "../language-input-stream";
import { NameToken } from "./name-token";
import { ParserPattern } from "./patterns/parser-pattern";
import { Token } from "./token";


export class VariableDeclarationToken extends Token {
    constructor(public name: string,
                public isConstant: boolean,
                public parser: ParserPattern) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        if (stream.matchNextString('#')) {
            if (stream.hasWhitespace()) {
                stream.croak(`you aren't allowed to put whitespace here`);
            }
            const isConstant = !!stream.matchNextString('!', false);
            if (stream.hasWhitespace()) {
                stream.croak(`you aren't allowed to put whitespace here`);
            }
            const result = NameToken.parse(stream);
            if (!result) {
                stream.croak(`after a # must follow a variable declaration`);
            }
            const name = result.name;
            const parser = ParserPattern.parse(stream);
            if (!parser) {
                stream.croak(`you need to define a parser as the variable value`);
            }
            return new VariableDeclarationToken(name, isConstant, parser);
        }
        return null;
    }
}