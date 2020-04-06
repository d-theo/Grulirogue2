import { Terrain } from "./terrain";

export const terrainGreece: Terrain = {
    Void: 9,
    DoorOpen: 10,
    DoorOpened: 21,
    DoorLocked: 11,
    Stair: 22,
    Button: 25,
    ButtonPushed: 24,
    CornerSE:8,
    CornerNW:0,
    CornerNE:2,
    CornerSW:6,
    WallN: 1,
    WallS: 7,
    WallE: 5,
    WallW: 3,
    Floor: 4,
    FloorAlt1: 18,
    FloorAlt2: 19,
    FloorAlt3: 20,
    Deco: 1000,
    Deco1: 12,
    Deco2: 13,
    Deco3: 14,
    Deco4: [15,16],
    Deco5: 17,
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