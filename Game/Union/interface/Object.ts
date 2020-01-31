import Vector2D from "./Vector2D";
import OBJECT_TYPE from "./ObjectType";

export interface BaseObjectData {
    id: string;
    type: OBJECT_TYPE;
};

export interface PlayerData extends BaseObjectData {
    hp: number;
    position: Vector2D;
    vector: Vector2D;
    speed: number;
};