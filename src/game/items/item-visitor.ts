import { Scroll } from "./scroll";
import { Potion } from "./potion";
import { Weapon } from "./weapon";
import { Armour } from "./armour";
import { Item } from "../entitybase/item";

export class ItemVisitor {
    visitWand(wand: Item) {
        return {
            kind: 'Reusable',
            item: wand,
            count: 1
        }
    }
    visitMisc(misc: Item) {
        return {
            kind: 'Consumables',
            item: misc,
            count: 1
        }
    }
    visitPotion(potion: Potion) {
        return {
            kind: 'Consumables',
            item: potion,
            count: 1
        }
    }
    visitScroll(scroll: Scroll) {
        return {
            kind: 'Consumables',
            item: scroll,
            count: 1
        }
    }
    visitWeapon(weapon: Weapon) {
        return {
            kind: 'Weapons',
            item: weapon,
        }
    }
    visitArmor(armor: Armour) {
        return {
            kind: 'Armours',
            item: armor,
        }
    }
}