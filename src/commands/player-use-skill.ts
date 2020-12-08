import { createEventDefinition, EventBus } from "ts-bus";
import { SkillNames } from "../game/hero/hero-skills";

export const playerUseSkill = createEventDefinition<{
    name: SkillNames
}>()('playerUseSkill');