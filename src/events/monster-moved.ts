import { createEventDefinition } from "ts-bus";
import { Monster } from "../game/monsters/monster";

export const monsterMoved = createEventDefinition<{
    monster: Monster
}>()("monsterMove");