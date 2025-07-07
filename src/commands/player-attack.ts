import { createEventDefinition, EventBus } from "ts-bus";
import { Monster } from "../game/entitybase/monsters/monster";

export const playerAttemptAttackMonster = createEventDefinition<{
  monster: Monster;
}>()("playerAttemptAttackMonster");
