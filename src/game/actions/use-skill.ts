import { Action } from "./action";
import { MessageResponseStatus } from "../utils/types";
import { gameBus, logPublished } from "../../eventBus/game-bus";

export class UseSkillAction extends Action {
    constructor(private args: {name}) {
        super();
    }
    execute() {
        const res = this.game.hero.heroSkills.canCastSkill(this.args.name);
        if (res.status === MessageResponseStatus.Ok) {
            this.game.nextTurn(res.timeSpent); // Traps resolve too early if nextTurn is after cast()
            this.game.hero.heroSkills.castSkill(this.args.name);
        } else {
            gameBus.publish(logPublished({level: 'neutral', data:`You cannot do that (${res.data})`}));
        }
    }
}