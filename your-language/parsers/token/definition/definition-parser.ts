import { LanguageInputStream } from "../../../language-input-stream";
import { Patterns } from "../../pattern/all-patterns";
import { LanguageTokenParser } from "../parser";
import { Tokens } from "../all-token-parsers";
import { DefinitionToken } from "./definition-token";

const TYPE_PARSERS = {
    import: Patterns.string,
    entrypoint: Patterns.function,
};

export class DefinitionTokenParser extends LanguageTokenParser<DefinitionToken> {
    async parseIntern(stream: LanguageInputStream) {
        if (!stream.matchNextString('!')) {
            return;
        }

        const name = (await Tokens.name(stream))?.name;
        if (!name) {
            stream.croak(`expected a definition name`);
        }

        if (!stream.matchNextString('(')) {
            stream.croak(`put the value of the definition inside rounded brackets`)
        }
        
        const parser = TYPE_PARSERS[name];
        if (!parser) {
            stream.croak(`there is no definition called ${name}`);
        }

        const result = await parser(stream);
        if (!result) {
            stream.croak(`expected a value of type ${parser.type}`);
        }

        if (!stream.matchNextString(')')) {
            stream.croak(`missing closing ')'`)
        }

        return new DefinitionToken(name, result);
    }
}