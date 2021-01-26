import { InputStream } from "../../input-stream";
import { CommentToken } from "../comment-token";
import { Pattern } from "./pattern";

export class ParserPattern extends Pattern {
    static parsers = [
        
    ]

    // TODO: fill
    constructor(public patterns: Pattern[]) {
        super();
    }

    static parse(stream: InputStream) {
        // skip comments
        // FIXME: kinda scary, because this works only on single line comments
        CommentToken.parse(stream);

        return null;
    }
}