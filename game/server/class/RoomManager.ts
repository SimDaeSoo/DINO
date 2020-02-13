import { Room, RoomOptions } from './room';
import * as socketIO from 'socket.io';
import Dictionary from '../../union/interface/Dictionary';

export class RoomManager {
    public userDict: Dictionary<string> = {};
    public rooms: Array<Room> = [];
    public roomNumber: number = 0;

    public createRoom(options?: RoomOptions): Room {
        const newRoom: Room = new Room(options);
        newRoom.setID(this.getUniqueRoomIndex());
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

    public joinRoom(socket: socketIO.Socket, roomName: string): boolean {
        let result: boolean = false;

        for (let key in this.rooms) {
            if (this.rooms[key].name === roomName && this.rooms[key].joinable) {
                result = true;
                socket.join(this.rooms[key].name);
                this.rooms[key].join(socket.id);

                this.userDict[socket.id] = roomName;

                break;
            }
        }

        return result;
    }

    public leaveRoom(socket: socketIO.Socket, roomName: string): boolean {
        let result: boolean = false;

        for (let key in this.rooms) {
            if (this.rooms[key].name === roomName) {
                result = true;
                socket.leave(this.rooms[key].name);
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

    public getUniqueRoomIndex(): number {
        this.roomNumber++;
        return this.roomNumber;
    }
}