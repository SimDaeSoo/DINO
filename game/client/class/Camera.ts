import Vector2D from '../../union/interface/Vector2D';

export default class Camera {
    public targetZoom: number = 1;
    public currentZoom: number = 1;
    public position: Vector2D = { x: 0, y: 0 };
    private screenWidth: number;
    private screenHeight: number;
    private stage: PIXI.Container = undefined;
    private targetObject: PIXI.Container = undefined;
    private resize: () => {};

    constructor() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.resize = this._resize.bind(this);
        window.addEventListener('resize', this.resize);
    }

    public update(dt: number): void {
        const FOLLOW_COEIFFICIENT: number = 1.004 ** dt - 1;
        const ZOOM_COEIFFICIENT: number = 1.003 ** dt - 1;
        this.updateFollowObj(FOLLOW_COEIFFICIENT);
        this.updateFollowZoom(ZOOM_COEIFFICIENT);
        this.updateStage();
    }

    public setStage(stage: PIXI.Container): void {
        this.stage = stage;
    }

    public setObject(targetObject: PIXI.Container): void {
        this.targetObject = targetObject;
    }

    public setZoom(value): void {
        this.targetZoom = value;
    }

    public destroy(): void {
        window.removeEventListener('resize', this.resize);
    }

    private _resize(): void {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
    }

    private updateStage(): void {
        if (this.stage === undefined) return;
        this.stage.scale.x = this.currentZoom;
        this.stage.scale.y = this.currentZoom;
        this.stage.position.x = this.position.x;
        this.stage.position.y = this.position.y;
    }

    private updateFollowObj(coeifficient: number): void {
        if (this.targetObject === undefined) return;

        const targetPosition: Vector2D = {
            x: ((-this.targetObject.position.x - this.targetObject.width / 2) * this.currentZoom + this.screenWidth / 2),
            y: ((-this.targetObject.position.y - this.targetObject.height / 2) * this.currentZoom + this.screenHeight / 2)
        };

        this.position.x += (targetPosition.x - this.position.x) * coeifficient;
        this.position.y += (targetPosition.y - this.position.y) * coeifficient;
    }

    private updateFollowZoom(coeifficient: number): void {
        const zoom: number = this.currentZoom + (this.targetZoom - this.currentZoom) * coeifficient;
        const centerPos: Vector2D = {
            x: (this.position.x - this.screenWidth / 2) / this.currentZoom,
            y: (this.position.y - this.screenHeight / 2) / this.currentZoom
        };

        this.currentZoom = zoom;
        this.position.x = (centerPos.x * this.currentZoom) + this.screenWidth / 2;
        this.position.y = (centerPos.y * this.currentZoom) + this.screenHeight / 2;
    }
}