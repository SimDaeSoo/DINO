import Dictionary from "../interface/Dictionary";
import DataContainer from "./DataContainer";
import { TILE_TYPE } from "../interface/TileData";
import MapGenerator from "./MapGenerator";
import { BaseObjectData } from "../interface/Object";
import BaseObject from "./BaseObject";
import ObjectFactory from "./ObjectFactory";

export interface IGameData {
    seed: string;
    objects: Array<BaseObjectData>;
}

export default class GameData extends DataContainer<IGameData> {
    public objects: Dictionary<BaseObject<BaseObjectData>>;
    public map: Array<Array<TILE_TYPE>>;

    public initialize(data: IGameData): void {
        this.objects = {};
        this.import(data);

        for (let objectData of this.data.objects) {
            this.objects[objectData.id] = ObjectFactory.create(objectData);
        }

        const mapGenerator: MapGenerator = new MapGenerator();
        mapGenerator.initialize({ seed: this.data.seed });
        mapGenerator.generate();

        this.map = mapGenerator.map;
    }

    public update(dt: number): void {
        for (let id in this.objects) {
            const object: BaseObject<BaseObjectData> = this.objects[id];
            object.update(dt);
        }
    }

    public setData(data: BaseObjectData): void {
        this.data.objects.forEach((object): void => {
            if (object.id === data.id) {
                object = data;
            }
        })
        this.objects[data.id].import(data);
    }
}