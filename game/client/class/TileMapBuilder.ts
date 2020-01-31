import * as PIXI from 'pixi.js';
import { TILE_TYPE } from '../../union/interface/TileData';

export default class TileMapBuilder {
    public static build(map: Array<Array<TILE_TYPE>>): PIXI.Container {
        const tileMap: PIXI.Container = new PIXI.Container();

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const tile: TILE_TYPE = map[y][x];

                if (tile === TILE_TYPE.GROUND) {
                    const container = new PIXI.Container();

                    const sprite = PIXI.Sprite.from(`static/tiles/tile0000.png`);
                    sprite.x = x * 8;
                    sprite.y = y * 8;

                    container.addChild(sprite);
                    tileMap.addChild(container);
                } else if (tile === TILE_TYPE.EMPTY) {
                    const neighbor = {
                        left: (map?.[y]?.[x - 1] === TILE_TYPE.GROUND) ? 1 : 0,
                        right: (map?.[y]?.[x + 1] === TILE_TYPE.GROUND) ? 1 : 0,
                        up: (map?.[y - 1]?.[x] === TILE_TYPE.GROUND) ? 1 : 0,
                        down: (map?.[y + 1]?.[x] === TILE_TYPE.GROUND) ? 1 : 0
                    };

                    const type: string = `${neighbor.left}${neighbor.right}${neighbor.up}${neighbor.down}`;

                    if (type !== '0000') {
                        const sprite = PIXI.Sprite.from(`static/tiles/tile${type}.png`);
                        tileMap.addChild(sprite);
                        sprite.x = x * 8;
                        sprite.y = y * 8;
                    }
                }
            }
        }

        setTimeout(() => {
            tileMap.cacheAsBitmap = true;
        }, 2000)

        return tileMap;
    }
}