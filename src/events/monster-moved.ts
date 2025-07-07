import { createEventDefinition } from "ts-bus";
import { Monster } from "../game/entitybase/monsters/monster";

export const monsterMoved = createEventDefinition<{
  monster: Monster;
}>()("monsterMove");
