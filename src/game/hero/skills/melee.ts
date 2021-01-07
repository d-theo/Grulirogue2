import { PassiveSkill } from "./passive-skills";

export class MeleePassiveSkill extends PassiveSkill {
    name: string = 'Melee weapons';
    description: string = 'Increase the damage and the accuracy of your melee weapons';
    onLevelUp(level: number) {
    }

}