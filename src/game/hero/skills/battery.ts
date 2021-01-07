import { PassiveSkill } from "./passive-skills";

export class BatteryPassiveSkill extends PassiveSkill {
    name: string = 'Battery';
    description: string = 'How big your dimensional zap battery is';
    onLevelUp(level: number) {
        this.hero.zapper.addMaxEnergy(level*2);
    }
}