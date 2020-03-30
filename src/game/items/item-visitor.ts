import { Weapon } from "../entitybase/weapon";
import { Scroll } from "./scroll";
import { Potion } from "./potion";
import { Armour } from "../entitybase/armour";

export class ItemVisitor {
    visitPotion(potion: Potion) {
        return {
            kind: 'Consumables',
            item: potion
        }
    }
    visitScroll(scroll: Scroll) {
        return {
            kind: 'Consumables',
            item: scroll
        }
    }
    visitWeapon(weapon: Weapon) {
        return {
            kind: 'Weapons',
            item: weapon
        }
    }
    visitArmor(armor: Armour) {
        return {
            kind: 'Armor',
            item: armor
        }
    }
}