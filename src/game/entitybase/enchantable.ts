export interface Enchantable {
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