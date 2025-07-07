import { gameBus } from "../../infra/events/game-bus";
import * as _ from "lodash";
import { randomIn } from "../../utils/rectangle";
import { MapGraph } from "../../world/generation/map_definition";
import { createRealityTome } from "../../content/loot/loot-mics";
import { Wands } from "../../content/loot/loot-wands";
import { Bestiaire } from "../../content/monsters/bestiaire";
import { XTable, getInTable } from "../../content/monsters/mob-table";
import { Wand } from "../entitybase/items/wands";

export const RogueEventLevel = 99;

export var RogueEventVars = {
  isRogueEventActive: false,
  eventHappened: false,
};

export const rogueBestiaire: XTable = [
  { chance: 40, type: Bestiaire.Rogue.Wizard },
  { chance: 25, type: Bestiaire.Rogue.Orc },
  { chance: 25, type: Bestiaire.Rogue.SkeletonWarrior },
];
export const LootWand = [
  Wands.Floral,
  Wands.Fire,
  Wands.Identification,
  Wands.Water,
];

export function spawnRogueEventItem(graph: MapGraph) {
  const exitRoom = graph.rooms.find((r) => r.isExit);
  if (!exitRoom) throw new Error("not exit");
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
