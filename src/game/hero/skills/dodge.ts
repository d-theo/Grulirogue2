import { PassiveSkill } from "./passive-skills";

export class DodgePassiveSkill extends PassiveSkill {
    name: string = 'Dodge';
    description: string = 'How good you are at dodging attacks';
    onLevelUp(level: number) {
        this.hero.dodge += level*0.05;
    }

}