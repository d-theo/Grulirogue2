import { Coordinate } from "../utils/coordinate";
import { Health } from "./health";
import { Armour } from "../items/armour";
import { Weapon } from "../items/weapon";
import { Buffs } from "./buffable";
import { EnchantTable } from "./enchantable";
import { DamageResolution } from "../fight/damages";

export interface Entity {
    health: Health;
    armour: Armour;
    dodge: number;

    pos: Coordinate;
    sight: number;

    weapon: Weapon;
    level: number;

    buffs: Buffs;
    enchants: EnchantTable;

    precision: number;
    takeDamages(c: DamageResolution);
    getAligment(): 'bad'|'good';
}