import { RoomData } from "./RoomData";

export default interface SocketServerData {
    address: string;
    rooms: Array<RoomData>;
    updated: number;
};