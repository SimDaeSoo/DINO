export interface RoomOptions {
    id?: number;
    name: string;
    maxMembers?: number;
    password?: string;
}

interface User { id: string, displayName: string };
export class Room {
    public members: Array<User> = [];
    public playTime: number = 0;
    private io: SocketIO.Server;
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

    public join(socket: SocketIO.Socket, displayName: string): void {
        this.members.push({
            id: socket.id,
            displayName: displayName
        });
        this.io.to(this.options.name).emit('test', displayName);
        // 이제 여기서 init 해준다.
    }

    public leave(id: string): void {
        let findIndex: number = 0;
        this.members.forEach((member: User, index: number): void => {
            if (member.id === id) {
                findIndex = index;
            }
        })

        if (findIndex >= 0) {
            this.members.splice(findIndex, 1);
        }
    }

    public destroy(): void {
        // 죽기전에 리스너도 떼주고 게임도 없애기 처리해준다.
    }

    public setID(id: number): void {
        this.options.id = id;
    }

    public setIO(io: SocketIO.Server): void {
        this.io = io;
    }
};