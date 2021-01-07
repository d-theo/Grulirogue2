import { PassiveSkill } from "./passive-skills";

export class RegenPassiveSkill extends PassiveSkill {
    name: string = 'HP Regen';
    description: string = 'Your HP regeneration speed';
    onLevelUp(level: number) {
        this.hero.health.regenerationRate -= 1;
        this.hero.health.tickPerRegen += 1;
    }
}