import BaseObject from "./BaseObject";
import { PlayerData } from "../interface/Object";

export default class Player extends BaseObject<PlayerData> {
    public update(dt: number): void { }
}