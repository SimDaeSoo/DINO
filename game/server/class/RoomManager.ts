import { Room, RoomOptions } from './Room';
import * as socketIO from 'socket.io';
import Dictionary from '../../union/interface/Dictionary';

export class RoomManager {
    public userDict: Dictionary<number> = {};
    public rooms: Array<Room> = [];
    public io: SocketIO.Server;

    public createRoom(options?: RoomOptions): Room {
        const newRoom: Room = new Room(options);
        newRoom.setIO(this.io);
        this.rooms.push(newRoom);

        return newRoom;
    }

    public destroyRoom(room: Room): void {
        const index: number = this.rooms.indexOf(room);

        if (index >= 0) {
            this.rooms.splice(index, 1);
            room.destroy();
        }
    }

    public joinRoom(socket: socketIO.Socket, id: number, displayName: string): boolean {
        let result: boolean = false;

        for (let key in this.rooms) {
            if (this.rooms[key].id === id && this.rooms[key].joinable) {
                result = true;
                socket.join(`${this.rooms[key].id}`);
                this.rooms[key].join(socket, displayName);

                this.userDict[socket.id] = id;

                break;
            }
        }

        return result;
    }

    public leaveRoom(socket: socketIO.Socket, id: number): boolean {
        let result: boolean = false;

        for (let key in this.rooms) {
            if (this.rooms[key].id === id) {
                result = true;
                socket.leave(`${this.rooms[key].id}`);
                this.rooms[key].leave(socket.id);

                delete this.userDict[socket.id];

                if (this.rooms[key].members.length <= 0) {
                    this.destroyRoom(this.rooms[key]);
                }

                break;
            }
        }

        return result;
    }

    public disconnect(socket: socketIO.Socket): void {
        this.leaveRoom(socket, this.userDict[socket.id]);
    }
}