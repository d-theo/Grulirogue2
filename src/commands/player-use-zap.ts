import { createEventDefinition, EventBus } from "ts-bus";
import { Monster } from "../game/monsters/monster";
import { Hero } from "../game/hero/hero";
import { Coordinate } from "../game/utils/coordinate";
import { Item } from "../game/entitybase/item";
import { ZapName } from "../game/hero/zap/allzaps";

export const playerUseZap = createEventDefinition<{
    name: ZapName,
    target: Monster | Hero | Coordinate | Item,
}>()('playerUseZap');