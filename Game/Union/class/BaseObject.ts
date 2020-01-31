import DataContainer from "./DataContainer";

export default class BaseObject<T> extends DataContainer<T>{
    public update(dt: number): void { }
};