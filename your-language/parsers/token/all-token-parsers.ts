import { bindMapParserContexts } from "./parser";
import { CommentTokenParser } from "./comment/comment-parser";
import { DefinitionTokenParser } from "./definition/definition-parser";
import { FunctionDeclarationTokenParser } from "./function/function-declaration-parser";
import { NameTokenParser } from "./name/name-parser";
import { VariableDeclarationTokenParser } from "./variable/variable-declaration-parser";
import { WhitespaceTokenParser } from "./whitespace/whitespace-parser";

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