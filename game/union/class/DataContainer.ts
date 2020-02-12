export default class DataContainer<T> {
    public data!: T;

    public import(data: T): void {
        this.data = data;
    }

    public export(): T {
        return this.data;
    }
}