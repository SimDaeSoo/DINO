import * as PIXI from 'pixi.js';
import Camera from './Camera';
import { Dictionary } from 'vue-router/types/router';
import GameData from '../../union/class/GameData';

interface GameRednererOptions {
    el: HTMLElement;
}

interface Layer {
    container: PIXI.Container;
    z: number;
}

export default class GameRenderer {
    private app: PIXI.Application;
    private stage: PIXI.Container;
    private layers: Dictionary<Layer>;
    private camera: Camera;
    private data: GameData;

    public initialize(options: GameRednererOptions): void {
        if (this.app) this.destroy();

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.ROUND_PIXELS = true;

        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            // backgroundColor: 0x7296D5,
            backgroundColor: 0xFFFFFF,
            autoStart: false,
            antialias: false,
            sharedLoader: true,
            powerPreference: 'high-performance',
            resizeTo: options.el
        });

        this.stage = new PIXI.Container();
        this.app.stage.addChild(this.stage);
        options.el.appendChild(this.app.view);

        this.layers = {};

        this.camera = new Camera();
        this.camera.setStage(this.stage);
        this.camera.setZoom(2);
    }

    public applyLayer(name: string, layer: Layer): void {
        if (!this.layers[name]) {
            this.layers[name] = layer;
        }
    }

    public deleteLayer(name: string): void {
        if (this.layers[name]) {
            this.layers[name].container.destroy();
            delete this.layers[name];
        }
    }

    public update(dt: number): void {
        this.camera.update(dt);
    }

    public render(): void {
        this.app.render();
    }

    public destroy(): void {
        if (this.stage) this.stage.destroy();
        if (this.app) this.app.destroy(true);
        this.camera.destroy();
        this.app = this.stage = this.layers = this.data = this.camera = undefined;
    }
}