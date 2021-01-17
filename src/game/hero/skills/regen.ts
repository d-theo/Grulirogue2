import { PassiveSkill } from "./passive-skills";

export class RegenPassiveSkill extends PassiveSkill {
    mapLevelValue = [1, 2, 2, 3, 3, 3, 4, 4, 4, 5];
    name: string = 'HP Regen';
    description: string = 'Your HP regeneration speed';
}