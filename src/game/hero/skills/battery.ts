import { PassiveSkill } from "./passive-skills";

export class BatteryPassiveSkill extends PassiveSkill {
    name = 'Battery size';
    mapLevelValue = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    description: string = 'How big your dimensional zap battery is';
}