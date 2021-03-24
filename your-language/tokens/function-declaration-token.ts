import { LanguageInputStream } from "../language-input-stream";
import { NameToken } from "./name-token";
import { ParserPattern } from "./patterns/parser-pattern";
import { Token } from "./token";
import { VariableDeclarationToken } from "./variable-declaration-token";
import { WhitespaceToken } from "./whitespace-token";
import { VariableCollection } from '../collections';
import { TokenCapture } from "../token-capture";


export class FunctionDeclarationToken extends Token {
    constructor(capture: TokenCapture,
                public name: string,
                public variables: VariableCollection,
                public parser: ParserPattern) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
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
            if (!stream.matchNextString(':')) {
                stream.croak(`a function must start with a ':' (at the end of the name)`);
            }

            // parse the variables and parser
            const variables: VariableDeclarationToken[] = [];
            let fnParser: ParserPattern;
            while (!stream.eof() && WhitespaceToken.parse(stream)?.isIdented()) {

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
                    console.log("parser:", parser.tokenCapture.capture);
                    stream.croak(`the parser was already declared, you can't create more than one`);
                }
                fnParser = parser;
            }

            const variableCollection = new VariableCollection(variables);
            return new FunctionDeclarationToken(capture.finish(), name, variableCollection, fnParser);
        }
        return null;
    }
}
