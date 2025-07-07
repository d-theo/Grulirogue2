import { randomIn } from '../../../utils/rectangle';
import { Terrain } from '../../map/terrain.greece';

export function pirateDeco(room, tilemapBg, tilemap) {
  const assign = (pos, type) => {
    if (tilemapBg[pos.y][pos.x] !== Terrain.Stair) {
      tilemap[pos.y][pos.x] = type;
    }
  };

  let pos = randomIn(room.rect, 1);
  tilemap[pos.y][pos.x] = Terrain.PirateFloorAlt;

  pos = randomIn(room.rect, 1);
  tilemap[pos.y][pos.x] = Terrain.PirateFloorAlt;

  //
  if (Math.random() > 0.7) {
    const pos = randomIn(room.rect, 1);
    assign(pos, Terrain.FloorRope);
  }
  if (Math.random() > 0.7) {
    const pos = randomIn(room.rect, 1);
    assign(pos, Terrain.Barrel);
  }
}
