import { createEventDefinition, EventBus } from "ts-bus";
import { Item } from "../game/entitybase/item";
import { Monster } from "../game/monsters/monster";
import { Hero } from "../game/hero/hero";
import { Coordinate } from "../game/utils/coordinate";

export const playerUseItem = createEventDefinition<{
    item: Item,
    target: Monster | Hero | Coordinate | Item,
    action: string,
}>()('playerUseItem');