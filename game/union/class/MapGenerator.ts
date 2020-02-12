import { TileData, TILE_TYPE, DIRECTION } from "../interface/TileData";
import Dictionary from "../interface/Dictionary";
import Vector2D from "../interface/Vector2D";
import * as SeedRandom from 'seedrandom';

export interface MapGeneratorOptions {
    seed?: string;
    size?: { width: number, height: number };
    density?: number;
}

// Regacy Code 한번 거둬내자 (Map 이 Dictionary일 필요가 없다.)
export default class MapGenerator {
    private seed!: string;
    private mapDictionary!: Dictionary<TileData>;
    private size!: Dictionary<number>;
    private density!: number;
    private currentTileCount!: number;
    private targetPositions!: Array<number>;
    private rng!: SeedRandom;

    // public method
    public initialize(options?: MapGeneratorOptions) {
        const DEFAULT_OPTIONS: MapGeneratorOptions = { seed: '', size: { width: 10, height: 10 }, density: 0.4 };
        options = Object.assign(DEFAULT_OPTIONS, options ? options : {});
        [this.size, this.seed, this.density, this.mapDictionary] = [options.size, options.seed, options.density, {}];
        [this.currentTileCount, this.targetPositions] = [0, []];
        this.rng = SeedRandom(this.seed);
    }

    public generate(): Dictionary<TileData> {
        const begineDate: number = Date.now();
        this.createTileAtPosition({ x: Math.floor(this.size.width / 2), y: Math.floor(this.size.height / 2) });

        while (this.currentDensity < this.density) {
            const randomIndex: number = Math.round(this.rng() * (this.targetPositions.length - 1));
            const randomPosition: Vector2D = this.indexToPosition(this.targetPositions[randomIndex]);
            const AREA: number = Math.round(this.rng() * 1);

            for (let y = randomPosition.y - AREA; y <= randomPosition.y + AREA; y++) {
                for (let x = randomPosition.x - AREA; x <= randomPosition.x + AREA; x++) {
                    if (x >= 0 && x < this.size.width && y >= 0 && y < this.size.height) {
                        this.createTileAtPosition({ x, y });
                    }
                }
            }
        }


        for (let y = 0; y < this.size.height; y++) {
            for (let x = 0; x < this.size.width; x++) {
                if (!this.mapDictionary[this.positionToIndex({ x, y })]) {
                    this.interpolation({ x, y });
                }
            }
        }

        console.log(`generate : ${Date.now() - begineDate}ms`);
        console.log(`width ${this.size.width * 8}px / height ${this.size.height * 8}px / ${this.currentTileCount} tiles`);
        return this.mapDictionary;
    }

    public get map(): Array<Array<TILE_TYPE>> {
        const tileArray: Array<Array<TILE_TYPE>> = [];

        for (let y = 0; y < this.size.height; y++) {
            tileArray.push([]);
            for (let x = 0; x < this.size.width; x++) {
                const tile: TileData | undefined = this.mapDictionary[this.positionToIndex({ x, y })];
                if (tile === undefined) {
                    tileArray[y].push(TILE_TYPE.EMPTY);
                } else {
                    tileArray[y].push(tile.type);
                }
            }
        }

        return tileArray;
    }

    public print(): void {
        const tileArray: Array<Array<TILE_TYPE>> = [];

        for (let y = 0; y < this.size.height; y++) {
            tileArray.push([]);
            for (let x = 0; x < this.size.width; x++) {
                const tile: TileData | undefined = this.mapDictionary[this.positionToIndex({ x, y })];
                if (tile !== undefined) {
                    tileArray[y].push(tile.type);
                } else {
                    tileArray[y].push(TILE_TYPE.EMPTY);
                }
            }
        }
        for (let y = 0; y < this.size.height; y++) {
            let tileString: string = tileArray[y].toString();
            tileString = tileString.replace(/,/g, ' ');
            tileString = tileString.replace(/1/g, '□');
            tileString = tileString.replace(/0/g, '■');
            console.log(tileString);
        }
    }

    public getTileAtPosition(position: Vector2D): TileData {
        let diff: number = Infinity;
        let target: TileData;

        for (let id in this.mapDictionary) {
            const tile: TileData = this.mapDictionary[id];
            const tileDiff: number = Math.sqrt((position.x - tile.position.x) ** 2 + (position.y - tile.position.y) ** 2);

            if (diff > tileDiff) {
                diff = tileDiff;
                target = tile;
            }
        }

        return target;
    }

    // private
    private interpolation(position: Vector2D): void {
        const neighbor: Dictionary<TileData> = {
            left: this.mapDictionary[this.positionToIndex({ x: position.x - 1, y: position.y })],
            right: this.mapDictionary[this.positionToIndex({ x: position.x + 1, y: position.y })],
            up: this.mapDictionary[this.positionToIndex({ x: position.x, y: position.y - 1 })],
            down: this.mapDictionary[this.positionToIndex({ x: position.x, y: position.y + 1 })]
        }
        if (neighbor.left && neighbor.right && neighbor.up && neighbor.down) {
            this.createTileAtPosition(position);
        }
    }
    
    private get currentDensity(): number {
        return this.currentTileCount / (this.size.width * this.size.height);
    }

    private createTileAtPosition(position: Vector2D): TileData {
        if (position.x === 0 || position.x === this.size.width - 1 || position.y === 0 || position.y === this.size.height - 1) return;
        if (this.mapDictionary[this.positionToIndex(position)]) return this.mapDictionary[this.positionToIndex(position)];

        this.mapDictionary[this.positionToIndex(position)] = {
            id: this.positionToIndex(position),
            type: TILE_TYPE.GROUND,
            position: position,
            neighbor: {}
        };

        this.setTargetPositions(this.mapDictionary[this.positionToIndex(position)]);
        this.getNeighborTiles(this.mapDictionary[this.positionToIndex(position)]).forEach((neighborTile: TileData): void => {
            this.linking(this.mapDictionary[this.positionToIndex(position)], neighborTile);
        });

        this.currentTileCount++;

        return this.mapDictionary[this.positionToIndex(position)];
    }

    private setTargetPositions(tile: TileData): void {
        for (let y = tile.position.y - 1; y <= tile.position.y + 1; y++) {
            for (let x = tile.position.x - 1; x <= tile.position.x + 1; x++) {
                const index: number = this.positionToIndex({ x, y });

                if (this.mapDictionary[index] === undefined && index >= 0 && this.targetPositions.indexOf(index) < 0) {
                    this.targetPositions.push(index);
                }
            }
        }

        const currentTileIndex: number = this.targetPositions.indexOf(this.positionToIndex(tile.position));
        if (currentTileIndex >= 0) {
            this.targetPositions.splice(currentTileIndex, 1);
        }
    }

    private linking(tileA: TileData, tileB: TileData): void {
        tileA.neighbor[this.positionToIndex(tileB.position)] = { to: tileB, from: tileA, weight: this.getLinkWeight(tileA, tileB) };
        tileB.neighbor[this.positionToIndex(tileA.position)] = { to: tileA, from: tileB, weight: this.getLinkWeight(tileB, tileA) };
    }

    private positionToIndex(position: Vector2D): number {
        if (position.x < 0 || position.x >= this.size.width || position.y < 0 || position.y >= this.size.height) {
            return -1;
        } else {
            return (position.x + position.y * this.size.width);
        }
    }

    private indexToPosition(index: number): Vector2D {
        return { x: index % this.size.width, y: Math.floor(index / this.size.width) };
    }

    private getNeighborTiles(tile: TileData): Array<TileData> {
        const neighborTiles: Array<TileData> = [];

        for (let y = tile.position.y - 1; y <= tile.position.y + 1; y++) {
            for (let x = tile.position.x - 1; x <= tile.position.x + 1; x++) {
                const neighbor: TileData | undefined = this.mapDictionary[this.positionToIndex({ x, y, })];

                if (neighbor !== undefined && neighbor !== tile) {
                    neighborTiles.push(neighbor);
                }
            }
        }
        return neighborTiles;
    }

    private getLinkDirection(from: TileData, to: TileData): DIRECTION {
        const diff: number = (to.position.x + to.position.y * this.size.width) - (from.position.x + from.position.y * this.size.width);
        let direction: DIRECTION;

        switch (diff) {
            case this.size.width:
                direction = DIRECTION.DOWN;
                break;
            case this.size.width - 1:
                direction = DIRECTION.LEFT_DOWN;
                break;
            case this.size.width + 1:
                direction = DIRECTION.RIGHT_DOWN;
                break;
            case -this.size.width:
                direction = DIRECTION.UP;
                break;
            case -this.size.width - 1:
                direction = DIRECTION.LEFT_UP;
                break;
            case -this.size.width + 1:
                direction = DIRECTION.RIGHT_UP;
                break;
            case -1:
                direction = DIRECTION.LEFT;
                break;
            case 1:
                direction = DIRECTION.RIGHT;
                break;
        }

        return direction;
    }

    private getLinkWeight(from: TileData, to: TileData): number {
        const direction: DIRECTION = this.getLinkDirection(from, to);
        let weight: number = 1;

        switch (direction) {
            case DIRECTION.LEFT_DOWN: case DIRECTION.LEFT_UP: case DIRECTION.RIGHT_DOWN: case DIRECTION.RIGHT_UP:
                weight = Math.sqrt(2);
                break;
        }

        return weight;
    }
}