import { PassiveSkill } from "./passive-skills";

export class BatteryPassiveSkill extends PassiveSkill {
    name: string = 'Battery';
    description: string = 'How big your dimensional zap battery is';
    onLevelUp(level: number) {
        throw new Error('Method not implemented.');
    }

}