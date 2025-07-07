import { createEventDefinition } from "ts-bus";
import { Monster } from "../game/entitybase/monsters/monster";

export const playerTookDammage = createEventDefinition<{
  amount: number;
  monster?: Monster;
  source?: string;
  baseHp: number;
  currentHp: number;
}>()("playerTookDammage");
