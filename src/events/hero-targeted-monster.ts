import { createEventDefinition } from "ts-bus";
import { Monster } from "../game/entitybase/monsters/monster";

export const heroTargetMonster = createEventDefinition<{
  monster: Monster;
}>()("heroTargetMonster");
