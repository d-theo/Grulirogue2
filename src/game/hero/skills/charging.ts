import { PassiveSkill } from "./passive-skills";

export class ChargingPassiveSkill extends PassiveSkill {
    mapLevelValue = [1, 2, 2, 3, 3, 3, 4, 4, 4, 5];
    name: string = 'Dynamo';
    description: string = 'How fast your dimensional zap is reloading its battery';
}