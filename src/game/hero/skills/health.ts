import { PassiveSkill } from "./passive-skills";

export class HealthPassiveSkill extends PassiveSkill {
    name: string = 'Heal';
    description: string = 'Increase your HP pool';
    onLevelUp(level: number) {
        this.hero.health.getStrongerByHp(level*5);
    }
}