import { LanguageInputStream } from "../language-input-stream";
import { NameToken } from "./name-token";
import { ParserPattern } from "./patterns/parser-pattern";
import { Token } from "./token";
import { VariableDeclarationToken } from "./variable-declaration-token";
import { WhitespaceToken } from "./whitespace-token";
import { VariableCollection } from '../collections';


export class FunctionDeclarationToken extends Token {
    constructor(public name: string,
                public variables: VariableCollection,
                public parser: ParserPattern) {
        super();
    }

    static parse(stream: LanguageInputStream) {
        if (stream.matchNextString('@')) {
            if (stream.hasWhitespace()) {
                stream.croak(`don't do whitespace between @ and function name`)
            }
            // parse the name
            const result = NameToken.parse(stream);
            if (!result) {
                stream.croak(`after '@' a function declaration must follow`);
            }
            const name = result.name;
            if (!stream.matchNextString(':', false)) {
                stream.croak(`a function must start with a ':' (at the end of the name)`);
            }

            console.log(" ##################### FUNCTION " + name);

            // parse the variables and parser
            const variables: VariableDeclarationToken[] = [];
            let fnParser: ParserPattern;
            while (!stream.eof()
            &&      WhitespaceToken.parse(stream)?.isIdented()) {

                // parse variable
                const variable = VariableDeclarationToken.parse(stream);
                if (variable) {
                    variables.push(variable);
                    console.log("- variable: " + variable.name);
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
                console.log("- parser");
                fnParser = parser;
            }

            const variableCollection = new VariableCollection(variables);
            return new FunctionDeclarationToken(name, variableCollection, fnParser);
        }
        return null;
    }
}