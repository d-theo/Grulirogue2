import { CommandHandler } from "./commands";
import { Hero } from "../hero/hero";
import { playerUseSkill } from "../../commands";
import { MessageResponseStatus } from "../utils/types";
import { gameBus } from "../../eventBus/game-bus";
import { timePassed, logPublished } from "../../events";

export class PlayerUseSkillHandler extends CommandHandler {
    constructor(
        private hero: Hero,
        ) {
        super();
    }
    handle(event: ReturnType<typeof playerUseSkill>) {
        const {name} = event.payload;
        const res = this.hero.heroSkills.canCastSkill(name);
        if (res.status === MessageResponseStatus.Ok) {
            // Traps resolve too early if nextTurn is after cast()
            gameBus.publish(timePassed({timeSpent: res.timeSpent}));
            this.hero.heroSkills.castSkill(name);
        } else {
            gameBus.publish(logPublished({level: 'neutral', data:'You cannot do that.'}));
        }
    }
}