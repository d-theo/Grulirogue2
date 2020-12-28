import { PassiveSkill } from "./passive-skills";

export class CastPassiveSkill extends PassiveSkill {
    name: string = 'Zap';
    description: string = 'How good you are at using your dimensional zap';
    onLevelUp(level: number) {
        throw new Error('Method not implemented.');
    }

}