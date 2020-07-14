import { gameBus } from "./game-bus";
import { XTable, getInTable } from "../game/monsters/mob-table";
import { Bestiaire } from "../game/monsters/bestiaire";
import { Wands } from "../game/loot/loot-wands";
import * as _ from 'lodash';
import { Wand } from "../game/items/wands";
import { createRealityTome } from "../game/loot/loot-mics";
import { MapGraph } from "../generation/map_definition";
import { randomIn } from "../game/utils/rectangle";

gameBus.subscribe('rogueEvent', () => {
    isRogueEventActive = true;
});
gameBus.subscribe('endRogueEvent', () => {
    isRogueEventActive = false;
    eventHappened = true;
});
export const RogueEventLevel = 99;
export var isRogueEventActive = false;
export var eventHappened = false;
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