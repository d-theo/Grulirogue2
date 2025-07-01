import { XTable, getInTable } from "../../monsters/mob-table";
import { Bestiaire } from "../../monsters/bestiaire";
import { Wands } from "../../loot/loot-wands";
import { randomIn } from "../../utils/rectangle";
import { createRealityTome } from "../../loot/loot-mics";
import _ from "lodash";
import { Wand } from "../../items/wands";
import { MapGraph } from "../../../world/generation/map_definition";

export const RogueEventLevel = 99;

export class RogueEventLevelSingleton {
    static isRogueEventActive = false;
    static eventHappened = false;
}

export const rogueBestiaire: XTable = [
    {chance: 40, type: Bestiaire.Rogue.Wizard},
    {chance: 25, type: Bestiaire.Rogue.Orc},
    {chance: 25, type: Bestiaire.Rogue.SkeletonWarrior},
];
export const LootWand = [
    Wands.Floral,
    Wands.Fire,
    Wands.Identification,
    Wands.Water,
];

export function spawnRogueEventItem(graph: MapGraph) {
    const exitRoom = graph.rooms.find(r => r.isExit);
    if (!exitRoom) throw new Error('not exit');
    const p1 = randomIn(exitRoom.rect);
    const p2 = randomIn(exitRoom.rect);
    const wand = randomWand();
    wand.pos = p1;

    const tomeOfReal = createRealityTome();
    tomeOfReal.pos = p2;
    return [tomeOfReal, wand];
}

export function randomWand() {
    const wand = _.sample(LootWand);
    return new Wand(wand);
}

export function rogueRandomMob() {
    return getInTable(rogueBestiaire);
}