import { createEventDefinition } from "ts-bus";
import { Monster } from "../game/monsters/monster";

export const monsterDead = createEventDefinition<{
    monster: Monster
}>()("monsterDead");