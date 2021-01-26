import { LanguageInputStream } from "./language-input-stream";
import { NameToken } from "./name-token";
import { ParserPattern } from "./patterns/parser-pattern";
import { Token } from "./token";
import { VariableDeclarationToken } from "./variable-declaration-token";
import { WhitespaceToken } from "./whitespace-token";


export class FunctionDeclarationToken extends Token {
    constructor(public name: string,
                public variables: VariableDeclarationToken[],
                public parser: ParserPattern) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        if (stream.matchNextString('@', false)) {
            // parse the name
            const result = NameToken.parse(stream);
            if (!result) {
                stream.croak(`after '@' a function declaration must follow`);
            }
            const name = result.name;
            if (!stream.matchNextString(':', false)) {
                stream.croak(`a function must start with a ':' (at the end of the name)`);
            }

            // parse the variables and parser
            const variables: VariableDeclarationToken[] = [];
            let fnParser: ParserPattern;
            while (!stream.eof()
            &&      WhitespaceToken.parse(stream)?.isIdented()) {

                // parse variable
                const variable = VariableDeclarationToken.parse(stream);
                if (variable) {
                    variables.push(variable);
                    continue;
                }

                // parse parser
                const parser = ParserPattern.parse(stream);
                if (!parser) {
                    stream.croak(`in a function please declare either a variable or the parser`);
                }
                if (fnParser) {
                    stream.croak(`the parser was already declared, you can't create more than one`);
                }
                fnParser = parser;
            }
            return new FunctionDeclarationToken(name, variables, fnParser);
        }
        return null;
    }
}