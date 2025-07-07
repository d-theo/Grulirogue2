import { createEventDefinition } from "ts-bus";
import { Monster } from "../entitybase/monsters/monster";

export const monsterDead = createEventDefinition<{
  monster: Monster;
}>()("monsterDead");
