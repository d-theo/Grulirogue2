import { PassiveSkill } from "./passive-skills";

export class HealthPassiveSkill extends PassiveSkill {
    mapLevelValue = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    name: string = 'Heal';
    description: string = 'Increase your HP pool';
}