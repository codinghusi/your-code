import { Checkpoint } from "../../your-language/input-stream";
import { CodeInputStream } from "../code-input-stream";
import { CodeError } from "./code-error";

export class SpecificCodeError extends CodeError {
    checkpoint: Checkpoint;

    constructor(public stream: CodeInputStream,
                message?: string) {
        super(message);
        this.checkpoint = stream.grabCheckpoint();
    }
}