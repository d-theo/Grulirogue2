import { gameBus } from "./game-bus";
import { XTable, getInTable } from "../game/monsters/mob-table";
import { Bestiaire } from "../game/monsters/bestiaire";
gameBus.subscribe('rogueEvent', () => {
    isRogueEventActive = true;
});
export const RogueEventLevel = 99;
export var isRogueEventActive = false;
export const rogueBestiaire: XTable = [
    {chance: 40, type: Bestiaire.Rogue.Wizard},
    {chance: 25, type: Bestiaire.Rogue.Orc},
    {chance: 25, type: Bestiaire.Rogue.SkeletonWarrior},
];
export function rogueRandomMob() {
    return getInTable(rogueBestiaire);
}