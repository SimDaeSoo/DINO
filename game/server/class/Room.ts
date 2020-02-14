import * as SocketIO from 'socket.io';
import Updater from '../../union/class/Updater';
import { ROOM_STATUS, USER_STATUS, RoomData, UserData } from '../../union/interface/RoomData';
export interface RoomOptions {
    id?: number;
    name: string;
    maxMembers?: number;
    password?: string;
}

interface User { id: string, socket: SocketIO.Socket, displayName: string, status: USER_STATUS };

export class Room {
    public members: Array<User> = [];
    public playTime: number = 0;
    public owner: string = '';
    public status: ROOM_STATUS = ROOM_STATUS.WAIT;
    public get id(): number { return this.options.id; }
    public get name(): string { return this.options.name; }
    public get maxMembers(): number { return this.options.maxMembers; }
    public get joinable(): boolean { return this.members.length < this.options.maxMembers && !this.isStarted; }
    private io: SocketIO.Server;
    private updater: Updater = new Updater();

    private options!: RoomOptions;
    private isStarted!: boolean;

    constructor(options?: RoomOptions) {
        let defaultOptions: RoomOptions = { id: 0, name: '', maxMembers: 6, password: '' };
        this.options = Object.assign(defaultOptions, options);
        this.initialize();
    }

    public join(socket: SocketIO.Socket, displayName: string): void {
        if (this.members.length === 0) this.owner = socket.id;
        this.members.push({
            id: socket.id,
            socket: socket,
            displayName: displayName,
            status: USER_STATUS.WAIT,
        });
        this.initializeSocket(socket);
    }

    public leave(id: string): void {
        let findIndex: number = 0;
        this.members.forEach((member: User, index: number): void => {
            if (member.id === id) {
                findIndex = index;
            }
        });

        if (findIndex >= 0) {
            this.members.splice(findIndex, 1);
            if (this.members.length > 0) this.owner = this.members[0].id;
        }
    }

    private initialize(): void {
        this.updater.on('sendRoomData', 1000, (): void => {
            this.io.to(this.options.name).emit('getRoomData', this.roomData);
        });
    }

    private initializeSocket(socket: SocketIO.Socket): void {
        // member.socket.on('test', undefined);
    }

    public destroy(): void {
        // 죽기전에 리스너도 떼주고 게임도 없애기 처리해준다.
        this.members.forEach((member: User): void => {
            // member.socket.off('test', undefined);
        });
        this.updater.removeAll();
    }

    public setID(id: number): void {
        this.options.id = id;
    }

    public setIO(io: SocketIO.Server): void {
        this.io = io;
    }

    public get roomData(): RoomData {
        const memberData: Array<UserData> = this.members.map((member: User): UserData => {
            return {
                id: member.id,
                displayName: member.displayName,
                status: member.status,
            };
        });

        return {
            id: this.id,
            name: this.name,
            members: memberData,
            maxMembers: this.maxMembers,
            playTime: this.playTime,
            owner: this.owner,
            status: this.status,
        }
    }
};