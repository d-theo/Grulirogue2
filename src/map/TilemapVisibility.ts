import {Tile, TileVisibility} from '../game/tilemap/tile';
import { Monster } from '../game/monsters/monster';

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
    setFogOfWar1(tiles: Tile[][], gameMonsters: {monster: Monster, sprite: any}[]) {
      const alphas = {
        [TileVisibility.OnSight]: 1,
        [TileVisibility.Hidden]: 0,
        [TileVisibility.Far]: 0,
      }
      gameMonsters.forEach(m => {
        const y = m.monster.pos.y;
        const x = m.monster.pos.x;
        m.sprite.alpha = alphas[tiles[y][x].visibility];
      });
    }
  }