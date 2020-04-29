import { makeRoomTile } from "../map_tiling_utils";
import { Terrain } from "../../map/terrain.greece";

export function snakeBossPainter(room, tilemapBg, tilemap) {
    const meh = {
        x:room.rect.x+1,
        y:room.rect.y+1,
        width: room.rect.width-2,
        height:room.rect.height-2,
    }
    makeRoomTile(meh, tilemapBg, {
        floor: Terrain.Carpet,
        walln: Terrain.CarpetN,
        walls: Terrain.CarpetS,
        walle: Terrain.CarpetE,
        wallw: Terrain.CarpetW,
        wallne: Terrain.CarpetNE,
        wallnw: Terrain.CarpetNW,
        wallse: Terrain.CarpetSE,
        wallsw: Terrain.CarpetSW,
    });

    const halfRect = {
        x:room.rect.x + Math.floor(room.rect.width/2)-1,
        y:room.rect.y + Math.floor(room.rect.height/2)-1,
        width:2,
        height:2,
    }
    makeRoomTile(halfRect, tilemapBg, {
        floor: Terrain.Piedestal,
        walln: Terrain.PiedestalN,
        walls: Terrain.PiedestalS,
        walle: Terrain.PiedestalE,
        wallw: Terrain.PiedestalW,
        wallne: Terrain.PiedestalNE,
        wallnw: Terrain.PiedestalNW,
        wallse: Terrain.PiedestalSE,
        wallsw: Terrain.PiedestalSW,
    });
}