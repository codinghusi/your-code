import { Checkpoint, InputStream } from "./input-stream";


export class TokenCapture {
    start: Checkpoint;
    end: Checkpoint;
    capture: string;

    constructor(public stream: InputStream) {
        this.start = stream.grabCheckpoint();
    }

    finish() {
        this.end = this.stream.grabCheckpoint();
        this.capture = this.stream.input.slice(this.start.position, this.end.position);
        return this;
    }

    toJSON() {
        return;
    }
}