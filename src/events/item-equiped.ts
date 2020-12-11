import { createEventDefinition } from "ts-bus";
import { Weapon } from "../game/items/weapon";
import { Armour } from "../game/items/armour";

export const itemEquiped = createEventDefinition<{
    weapon?: Weapon,
    armour?: Armour
}>()('itemEquiped');