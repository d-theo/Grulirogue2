import { PassiveSkill } from "./passive-skills";

export class RegenPassiveSkill extends PassiveSkill {
    name: string = 'HP Regen';
    description: string = 'Your HP regeneration speed';
    onLevelUp(level: number) {
        throw new Error('Method not implemented.');
    }
}