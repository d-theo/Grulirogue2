import { PassiveSkill } from "./passive-skills";

export class DynamoPassiveSkill extends PassiveSkill {
    name: string = 'Dynamo';
    description: string = 'How fast your dimensional zap is reloading its battery';
    onLevelUp(level: number) {
        this.hero.zapper.improveEnergyPerTickRate(level);
    }
}