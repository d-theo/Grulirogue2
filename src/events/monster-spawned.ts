import { createEventDefinition } from "ts-bus";
import { Monster } from "../game/monsters/monster";

export const monsterSpawned = createEventDefinition<{
    monster: Monster,
}>()('monsterSpawned');