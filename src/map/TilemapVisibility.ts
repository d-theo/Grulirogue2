import {Tile, TileVisibility} from '../game/tilemap/tile';

export class TilemapVisibility {
    constructor(private shadowLayer) {}
    setFogOfWar2(tiles: Tile[][]) {
      const alphas = {
        [TileVisibility.OnSight]: 0,
        [TileVisibility.Hidden]: 1,
        [TileVisibility.Far]: 0.5,
      }
      this.shadowLayer.forEachTile(
        t => {
          t.alpha = alphas[tiles[t.y][t.x].visibility];
        },
        this,
        0,
        0,
        tiles.length,
        tiles.length
      );
    }
  }