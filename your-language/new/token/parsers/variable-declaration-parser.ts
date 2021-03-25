import { LanguageInputStream } from "../../../language-input-stream";
import { Patterns } from "../../pattern/parsers/all-patterns";
import { VariableDeclarationToken } from "../tokens/variable-declaration-token";
import { LanguageTokenParser } from "../parser";
import { Tokens } from "./all-token-parsers";

export class VariableDeclarationTokenParser extends LanguageTokenParser<VariableDeclarationToken> {
    async parseIntern(stream: LanguageInputStream) {
        if (stream.matchNextString('#')) {
            if (stream.hasWhitespace()) {
                stream.croak(`you aren't allowed to put whitespace here`);
            }
            const isConstant = !!stream.matchNextString('!');
            if (stream.hasWhitespace()) {
                stream.croak(`you aren't allowed to put whitespace here`);
            }
            const nameToken = await Tokens.name(stream);
            if (!nameToken) {
                stream.croak(`after a # must follow a variable declaration`);
            }
            if (!stream.matchWhitespace()) {
                stream.croak(`please leave a gap between variable name and the value`);
            }
            const name = nameToken.name;
            const parser = await Patterns.chained(stream);
            if (!parser) {
                stream.croak(`you need to define a parser as the variable value`);
            }
            return new VariableDeclarationToken(name, isConstant, parser);
        }
        return null;
    }
}
