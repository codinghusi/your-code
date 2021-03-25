import { CommentTokenParser } from "./comment-parser";
import { DefinitionTokenParser } from "./definition-parser";
import { FunctionDeclarationTokenParser } from "./function-declaration-parser";
import { NameTokenParser } from "./name-parser";
import { VariableDeclarationTokenParser } from "./variable-declaration-parser";
import { WhitespaceTokenParser } from "./whitespace-parser";

export const Tokens = {
    name: new NameTokenParser().parse,
    definition: new DefinitionTokenParser().parse,
    variable: new VariableDeclarationTokenParser().parse,
    function: new FunctionDeclarationTokenParser().parse,
    whitespace: new WhitespaceTokenParser().parse,
    comment: new CommentTokenParser().parse
}