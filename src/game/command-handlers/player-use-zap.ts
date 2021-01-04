import { CommandHandler } from "./commands";
import { Hero } from "../hero/hero";
import { playerUseZap } from "../../commands";
import { MessageResponseStatus } from "../utils/types";
import { gameBus } from "../../eventBus/game-bus";
import { timePassed, logPublished } from "../../events";
import { CastPassiveSkill } from "../hero/skills/cast";

export class PlayerUseZapHandler extends CommandHandler {
    constructor(
        private hero: Hero,
        ) {
        super();
    }
    handle(event: ReturnType<typeof playerUseZap>) {
        const {name, target} = event.payload;
        const zapLevel = this.hero.skills.levelOfSkill(CastPassiveSkill);
        const res = this.hero.zapper.tryZap(zapLevel, name, target);
        if (res.status === MessageResponseStatus.Ok) {
            gameBus.publish(timePassed({timeSpent: res.timeSpent}));
        } else {
            gameBus.publish(timePassed({timeSpent: res.timeSpent}));
            if (res.data) {
                gameBus.publish(logPublished({level: 'neutral', data: res.data}));
            }
        }
    }
}