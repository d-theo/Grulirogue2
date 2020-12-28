import { EventHandler } from "./event-handler";
import { Hero } from "../hero/hero";
import { heroGainedXp, xpHasChanged } from "../../events";
import { gameBus } from "../../eventBus/game-bus";

export class HeroGainedXPHandler extends EventHandler {
    constructor(private hero: Hero) {
        super();
    }
    handle(event: ReturnType<typeof heroGainedXp>) {
        this.hero.gainXP(event.payload.amount);
    }
}