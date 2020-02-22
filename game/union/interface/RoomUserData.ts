import { RoomCharacterData } from './RoomCharacterData';

export interface RoomUserData {
    id: string;
    displayName: string;
    status: USER_STATUS;
    character: RoomCharacterData;
}

export const enum USER_STATUS {
    WAIT = 'WAIT',
    READY = 'READY',
}