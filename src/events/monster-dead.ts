import { createEventDefinition } from "ts-bus";
import { Monster } from "../game/entitybase/monsters/monster";

export const monsterDead = createEventDefinition<{
  monster: Monster;
}>()("monsterDead");
