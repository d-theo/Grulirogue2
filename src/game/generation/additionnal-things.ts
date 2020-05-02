import { ThingToPlace } from "../../generation/map_tiling_utils";
import { MonsterCollection } from "../monsters/monsterCollection";
import { ItemCollection } from "../items/item-collection";
import { Bestiaire } from "../monsters/bestiaire";
import { Monster } from "../monsters/monster";
import { getInTable } from "../monsters/mob-table";
import { Potion } from "../items/potion";
import { PotionTable, MiscTable } from "../loot/loot-table";
import { Weapon } from "../items/weapon";
import { craftWeapon } from "../loot/loot-weapons";

export function makeThings(
    additional: ThingToPlace[],
    monsterCollection: MonsterCollection,
    itemCollection: ItemCollection) {
    for (const add of additional) {
        switch (add.type) {
            case 'snakeBoss': 
                let m = Bestiaire.Greece.SnakeKing;
                const king = Monster.makeMonster(Object.assign(m, {pos: add.pos}));
                monsterCollection.monstersArray().push(king);
                break;
            case 'potion':
                const p = getInTable(PotionTable);
                const potion = new Potion({
                    name: p.name,
                    description: p.description,
                    effect: p.effect()
                });
                potion.pos = add.pos;
                itemCollection.itemsArray().push(potion);
                break;
            case 'misc':
                const miscItem = getInTable(MiscTable);
                const it = miscItem();
                it.pos = add.pos;
                itemCollection.itemsArray().push(it);
                break;
            case 'monster':
                let _snake = Bestiaire.Greece.Snake;
                const snake = Monster.makeMonster(Object.assign(_snake, {pos: add.pos}));
                monsterCollection.monstersArray().push(snake);
                break;
            case 'item-good':
                let item: Weapon = craftWeapon(3);
                item.pos = add.pos;
                itemCollection.itemsArray().push(item);
                break;
            case 'pirateBoss': 
                let p1 = Bestiaire.Pirate.PirateBoss;
                const pking = Monster.makeMonster(Object.assign(p1, {pos: add.pos}));
                monsterCollection.monstersArray().push(pking);
                break;
            case 'sailor': 
                let p2 = Bestiaire.Pirate.Sailor;
                const sailor = Monster.makeMonster(Object.assign(p2, {pos: add.pos}));
                monsterCollection.monstersArray().push(sailor);
                break;
            case 'crab': 
                let crab = Bestiaire.Pirate.Crab;
                const _crab = Monster.makeMonster(Object.assign(crab, {pos: add.pos}));
                monsterCollection.monstersArray().push(_crab);
                break;                
            case 'crabBoss': 
                let crabBoss = Bestiaire.Pirate.CrabBoss;
                const _crabBoss = Monster.makeMonster(Object.assign(crabBoss, {pos: add.pos}));
                monsterCollection.monstersArray().push(_crabBoss);
                break;
            default:
                console.log('add this stuff not impl'+add.type);
                break;
        }
    }
}