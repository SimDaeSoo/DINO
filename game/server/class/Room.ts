import * as SocketIO from 'socket.io';
import Updater from '../../union/class/Updater';
import { ROOM_STATUS, USER_STATUS, RoomData, UserData } from '../../union/interface/RoomData';
import CharacterData from '../../union/data/character';
import * as crypto from 'crypto';

export interface RoomOptions {
    id?: number;
    name: string;
    maxMembers?: number;
    password?: string;
}

interface User { id: string, socket: SocketIO.Socket, displayName: string, status: USER_STATUS, characterCode: number };

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
            characterCode: 1,
        });
        this.initializeSocket(socket);
    }

    public leave(id: string): void {
        let findIndex: number = 0;
        this.members.forEach((member: User, index: number): void => {
            if (member.id === id) {
                this.destroySocket(member.socket);
                findIndex = index;
            }
        });

        if (findIndex >= 0) {
            this.members.splice(findIndex, 1);
            if (this.members.length > 0) this.owner = this.members[0].id;
        }
    }

    private initialize(): void {
        this.updater.on('sendRoomData', 200, (): void => {
            this.io.to(`${this.options.id}`).emit('getRoomData', this.roomData);
        });
    }

    private initializeSocket(socket: SocketIO.Socket): void {
        socket.on('toggleReady', (): void => {
            this.toggleReady(socket);
        });
        socket.on('changeCharacter', (code: number): void => {
            this.changeCharacter(socket, code);
        });
        socket.on('ban', (banUserID: string): void => {
            if (socket.id === this.owner) {
                const user: User = this.getMemberByID(banUserID);
                user.socket.disconnect();
            }
        });
    }

    private destroySocket(socket: SocketIO.Socket): void {
        socket.removeAllListeners('toggleReady');
        socket.removeAllListeners('changeCharacter');
        socket.removeAllListeners('ban');
    }

    public destroy(): void {
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
                character: CharacterData[member.characterCode],
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

    public getMember(socket: SocketIO.Socket): User {
        let user: User;
        this.members.forEach((member: User): void => {
            if (member.id === socket.id) {
                user = member;
            }
        });

        return user;
    }

    public getMemberByID(id: string): User {
        let user: User;
        this.members.forEach((member: User): void => {
            if (member.id === id) {
                user = member;
            }
        });

        return user;
    }

    private gameStart(): void {
        this.updater.removeAll();
        this.members.forEach((member: User): void => {
            this.destroySocket(member.socket);
        });
        this.io.to(`${this.options.id}`).emit('getRoomData', this.roomData);
        this.io.to(`${this.options.id}`).emit('startGame');
    }

    private startCount: number = 5;
    private counting: boolean = false;
    private toggleReady(socket: SocketIO.Socket): void {
        const member: User = this.getMember(socket);

        if (member.status === USER_STATUS.READY) {
            member.status = USER_STATUS.WAIT;
        } else {
            member.status = USER_STATUS.READY;
        }

        this.startCount = 6;
        this.startCounting();
    }
    private startCounting(): void {
        if (this.isAllReady && !this.counting) {
            this.startCount--;
            this.counting = true;
            this.io.to(`${this.options.id}`).emit('startCounting', this.startCount);
            setTimeout((): void => {
                this.counting = false;
                if (this.startCount > 1) {
                    this.startCounting();
                } else {
                    this.gameStart();
                }
            }, 1000);
        }
    }
    private get isAllReady(): boolean {
        let result: boolean = true;

        for (let member of this.members) {
            result = result && member.status === USER_STATUS.READY;
        }

        return result;
    }

    private changeCharacter(socket: SocketIO.Socket, code: number): void {
        const member: User = this.getMember(socket);
        if (member.status !== USER_STATUS.READY) {
            member.characterCode = code;
        }
    }
};