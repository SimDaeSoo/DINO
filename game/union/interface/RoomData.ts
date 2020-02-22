import { RoomUserData } from './RoomUserData';
export interface RoomData {
    id: number;
    name: string;
    members: Array<RoomUserData>;
    maxMembers: number;
    playTime: number;
    owner: string;
    address?: string;
    status: ROOM_STATUS;
    seed: string;
}

export const enum ROOM_STATUS {
    WAIT = 'WAIT',
    START = 'START',
}