import { gameBus } from "../../../eventBus/game-bus";
import { PassiveSkill } from "./passive-skills";

export class CastPassiveSkill extends PassiveSkill {
    mapLevelValue = [];
    name: string = 'Zap';
    description: string = 'How good you are at using your dimensional zap';
}