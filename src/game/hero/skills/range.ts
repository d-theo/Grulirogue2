import { PassiveSkill } from "./passive-skills";

export class RangePassiveSkill extends PassiveSkill {
    name: string = 'Ranged weapons';
    description: string = 'Increase the damage and the accuracy of your ranged weapons';
    onLevelUp(level: number) {
        
    }

}