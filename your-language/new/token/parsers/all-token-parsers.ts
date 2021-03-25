import { bindMapParserContexts } from "../parser";
import { CommentTokenParser } from "./comment-parser";
import { DefinitionTokenParser } from "./definition-parser";
import { FunctionDeclarationTokenParser } from "./function-declaration-parser";
import { NameTokenParser } from "./name-parser";
import { VariableDeclarationTokenParser } from "./variable-declaration-parser";
import { WhitespaceTokenParser } from "./whitespace-parser";

const TokenParsers = {
    name: new NameTokenParser(),
    definition: new DefinitionTokenParser(),
    variable: new VariableDeclarationTokenParser(),
    function: new FunctionDeclarationTokenParser(),
    whitespace: new WhitespaceTokenParser(),
    comment: new CommentTokenParser()
};

export const Tokens = {
    name: TokenParsers.name.parse,
    definition: TokenParsers.definition.parse,
    variable: TokenParsers.variable.parse,
    function: TokenParsers.function.parse,
    whitespace: TokenParsers.whitespace.parse,
    comment: TokenParsers.comment.parse
};

bindMapParserContexts(Tokens, TokenParsers);