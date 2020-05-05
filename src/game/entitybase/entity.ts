import { Coordinate } from "../utils/coordinate";
import { Health } from "./health";
import { Armour } from "../items/armour";
import { Weapon } from "../items/weapon";
import { Buffs } from "./buffable";
import { EnchantTable } from "./enchantable";

export interface Entity {
    health: Health;
    armour: Armour|null;
    dodge: number;

    pos: Coordinate;
    sight: number;

    weapon: Weapon|null;
    level: number;

    buffs: Buffs;
    enchants: EnchantTable;
}