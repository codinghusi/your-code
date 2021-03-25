import { VariableCollection } from "../../../collections";
import { LanguageInputStream } from "../../../language-input-stream";
import { Patterns } from "../../pattern/parsers/parsers";
import { PatternChainPattern } from "../../pattern/patterns/pattern-chain-pattern";
import { FunctionDeclarationToken } from "../tokens/function-declaration-token";
import { LanguageTokenParser } from "../parser";
import { Tokens } from "./token-parsers";
import { VariableDeclarationToken } from "../tokens/variable-declaration-token";


export class FunctionDeclarationTokenParser extends LanguageTokenParser<FunctionDeclarationToken> {
    async parseIntern(stream: LanguageInputStream) {
        if (stream.matchNextString('@')) {
            if (stream.hasWhitespace()) {
                stream.croak(`don't do whitespace between @ and function name`)
            }
            // parse the name
            const nameToken = await Tokens.name(stream);
            if (!nameToken) {
                stream.croak(`after '@' a function declaration must follow`);
            }
            const name = nameToken.name;
            if (!stream.matchNextString(':')) {
                stream.croak(`a function must start with a ':' (at the end of the name)`);
            }

            // parse the variables and parser
            const variables: VariableDeclarationToken[] = [];
            let fnParser: PatternChainPattern;
            while (!stream.eof() && (await Tokens.whitespace(stream))?.isIdented()) {

                // parse variable
                const variable = await Tokens.variable(stream);
                if (variable) {
                    variables.push(variable);
                    continue;
                }

                // parse parser
                const parser = await Patterns.chained(stream);
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
            return new FunctionDeclarationToken(name, variableCollection, fnParser);
        }
        return null;
    }
}
