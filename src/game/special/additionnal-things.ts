import { ThingToPlace } from "../../generation/map_tiling_utils";
import { MonsterCollection } from "../monsters/monsterCollection";
import { ItemCollection } from "../items/item-collection";
import { Bestiaire } from "../monsters/bestiaire";
import { Monster } from "../monsters/monster";
import { getInTable } from "../monsters/mob-table";
import { Potion } from "../items/potion";
import { PotionTable } from "../loot/loot-table";
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
            default:
                console.log('add this stuff not impl'+add.type);
                break;
        }
    }
}