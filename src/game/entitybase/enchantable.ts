import { Buffs } from "./buffable";

export interface Enchantable {
    buffs: Buffs;
    enchants: EnchantTable
}
export class EnchantTable {
    stuned = false;
    bleeding = false;
    invisibility = false;
    poisoned = false;
    stupid=false;
    speed=false;
}