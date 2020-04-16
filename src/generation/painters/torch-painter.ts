import { lineTile } from "../map_tiling";
import { pointsOfRect } from "../map-geo";
import { Terrain } from "../../map/terrain";

export function torchPainter(room, tilemap, terrain: Terrain) {
    const points = pointsOfRect(room.rect);
    lineTile(points.A, points.B, tilemap, terrain.Torch, 0.25);
}