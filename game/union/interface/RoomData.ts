export interface CharacterData {
    code: number;
    name: string;
    description: string;
    preview: string;
}

export interface UserData {
    id: string;
    displayName: string;
    status: USER_STATUS;
    character: CharacterData;
}
export interface RoomData {
    id: number,
    name: string,
    members: Array<UserData>,
    maxMembers: number,
    playTime: number,
    owner: string,
    address?: string,
    status: ROOM_STATUS,
}

export const enum ROOM_STATUS {
    WAIT = 'WAIT',
}

export const enum USER_STATUS {
    WAIT = 'WAIT',
    READY = 'READY',
}