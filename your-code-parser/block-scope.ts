

type Members<T> = { [key: string]: T };

export class BlockScope<T> {
    
    
    constructor(protected parent?: BlockScope<T>,
                protected members: Members<T> = {},
                protected errorMessage?: (name: string) => string) { }

    get(name: string): T {
        const value = this.members[name] ?? this.parent?.get(name);
        if (!value && this.errorMessage) {
            throw new Error(this.errorMessage(name));
        }
        return value;
    }

    set(name: string, value: T) {
        this.members[name] = value;
        return this;
    }

    collect() {
        return Object.entries(this.members).map(([key, value]) => ({name: key, value}));
    }

    collectValues() {
        return Object.values(this.members);
    }

    newScope(members?: Members<T>) {
        return new BlockScope(this, members);
    }
}