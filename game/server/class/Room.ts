export interface RoomOptions {
    id?: number;
    name: string;
    maxMembers?: number;
    password?: string;
}

export class Room {
    public members: Array<string> = [];
    public playTime: number = 0;
    public get id(): number { return this.options.id; }
    public get name(): string { return this.options.name; }
    public get maxMembers(): number { return this.options.maxMembers; }
    public get joinable(): boolean { return this.members.length < this.options.maxMembers && !this.isStarted; }

    private options!: RoomOptions;
    private isStarted!: boolean;

    constructor(options?: RoomOptions) {
        let defaultOptions: RoomOptions = { id: 0, name: '', maxMembers: 8, password: '' };
        this.options = Object.assign(defaultOptions, options);
    }

    public join(id: string): void {
        this.members.push(id);
    }

    public leave(id: string): void {
        const index: number = this.members.indexOf(id);

        if (index >= 0) {
            this.members.splice(index, 1);
        }
    }

    public destroy(): void {
    }

    public setID(id: number): void {
        this.options.id = id;
    }
};