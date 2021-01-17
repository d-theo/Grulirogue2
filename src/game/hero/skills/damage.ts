import { PassiveSkill } from "./passive-skills";

export class DamagePassiveSkill extends PassiveSkill {
    mapLevelValue = [1,2,3,4,5,6,7,8,9,10];
    name: string = 'Damage';
    description: string = 'Increase the damage of your weapons';
}