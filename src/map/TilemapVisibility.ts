import {Tile, TileVisibility} from '../game/tilemap/tile';

export class TilemapVisibility {
    activeRoom;
    constructor(private shadowLayer) {}
  
    setActiveRoom(room) {
      // We only need to update the tiles if the active room has changed
      if (room !== this.activeRoom) {
        this.setRoomAlpha(room, 0); // Make the new room visible
        if (this.activeRoom) this.setRoomAlpha(this.activeRoom, 0.5); // Dim the old room
        this.activeRoom = room;
      }
    }

    setFogOfWar(tiles: Tile[]) {
      const alphas = {
        [TileVisibility.OnSight]: 0,
        [TileVisibility.Hidden]: 1,
        [TileVisibility.Far]: 0.5,
      }
      for (const t of tiles) {
        this.shadowLayer.getTileAt(t.pos.x, t.pos.y).alpha = alphas[t.visibility];
      }
    }
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
  
    // Helper to set the alpha on all tiles within a room
    setRoomAlpha(room, alpha) {
      this.shadowLayer.forEachTile(
        t => (t.alpha = alpha),
        this,
        room.x,
        room.y,
        room.width+1,
        room.height+1
      );
    }
  }