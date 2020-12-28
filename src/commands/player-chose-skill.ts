import { createEventDefinition, EventBus } from "ts-bus";
import { PassiveSkill } from "../game/hero/skills/passive-skills";

export const playerChoseSkill = createEventDefinition<{
    skills: PassiveSkill[];
}>()('playerChoseSkill');