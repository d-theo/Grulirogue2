import { PassiveSkill } from "./passive-skills";

export class DodgePassiveSkill extends PassiveSkill {
    mapLevelValue = [0.05, 0.7, 0.10, 0.13, 0.15, 0.20, 0.21, 0.22, 0.23, 0.25];
    name: string = 'Dodge';
    description: string = 'How good you are at dodging attacks';
}