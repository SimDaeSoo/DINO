import { BaseObjectData, PlayerData } from "../interface/Object";
import BaseObject from "./BaseObject";
import Player from "./Player";
import OBJECT_TYPE from "../interface/ObjectType";

export default class ObjectFactory {
    public static create(data: BaseObjectData): BaseObject<BaseObjectData> {
        if (data.type === OBJECT_TYPE.PLAYER) {
            const player: Player = new Player();
            player.import(data as PlayerData);
            return player;
        } else {
            const object: BaseObject<BaseObjectData> = new BaseObject();
            object.import(data);
            return object;
        }
    }
}