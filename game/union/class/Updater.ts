import Dictionary from "../interface/Dictionary";

export default class Updater {
    private updateCallback: Dictionary<NodeJS.Timeout>;

    public on(name: string, duration: number, callback: Function): void {
        let lastTime: number = Date.now();
        this.updateCallback[name] = setInterval(async () => {
            const dt: number = Date.now() - lastTime;
            callback(dt);
            lastTime += dt;
        }, duration);
    }

    public remove(name: string): void {
        clearInterval(this.updateCallback[name]);
        delete this.updateCallback[name];
    }
}