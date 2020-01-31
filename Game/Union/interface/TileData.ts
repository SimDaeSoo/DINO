import Vector2D from './Vector2D';

export const enum DIRECTION {
    LEFT,
    RIGHT,
    UP,
    DOWN,
    LEFT_UP,
    LEFT_DOWN,
    RIGHT_UP,
    RIGHT_DOWN
}

export const enum TILE_TYPE {
    GROUND,
    EMPTY
}

export interface Path {
    to: TileData;
    from: TileData;
    weight: number;
}

export type Neighbor = {
    [ket: number]: Path;
}

export interface TileData {
    id: number;
    type: TILE_TYPE;
    position: Vector2D;
    neighbor: Neighbor;
}