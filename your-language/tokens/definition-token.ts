import { LanguageInputStream } from '../language-input-stream';
import { Token } from "./token";
import { Pattern } from './patterns/pattern';
import { NameToken } from './name-token';
import { StringPattern } from './patterns/string-pattern';
import { FunctionPattern } from './patterns/function-pattern';
import { TokenCapture } from '../token-capture';

interface TypeParsers {
    [key: string]: TypeParser
}

interface TypeParser {
    type: string;
    parse(stream: LanguageInputStream): any;
}

const TYPE_PARSERS: TypeParsers = {
    import: StringPattern,
    entrypoint: FunctionPattern,
};

export class DefinitionToken extends Token {
    constructor(capture: TokenCapture,
                public name: string,
                public value: Pattern) {
        super(capture);
    }

    static parse(stream: LanguageInputStream) {
        const capture = stream.startCapture();
        
        if (!stream.matchNextString('!')) {
            return;
        }

        const name = NameToken.parse(stream)?.name;
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

        const result = parser.parse(stream);
        if (!result) {
            stream.croak(`expected a value of type ${parser.type}`);
        }

        if (!stream.matchNextString(')')) {
            stream.croak(`missing closing ')'`)
        }

        return new DefinitionToken(capture.finish(), name, result);
    }
}