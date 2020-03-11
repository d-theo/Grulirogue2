import { Terrain } from "./terrain";

export const terrainGreece: Terrain = {
    Void: 9,
    DoorOpen: 10,
    DoorLocked: 10,
    CornerSE:8,
    CornerNW:0,
    CornerNE:2,
    CornerSW:6,
    WallN: 1,
    WallS: 7,
    WallE: 5,
    WallW: 3,
    Floor: 4,
};
export const GreeceCreationParams = {
    Area: 250, // min area of a room
    Fuzz: 0.25, // room size variation +-
    MinClusterSize: 5, // minimal cluster of room
    Width: 60,
    Height: 40,
    MinSubSize: 6, // subdivise into subcluster if cluster is bigger than MinSubSize
    canvasWidth: 100,
    canvasHeight: 100,
    Terrain: terrainGreece
};