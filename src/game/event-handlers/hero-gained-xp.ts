import { EventHandler } from "./event-handler";
import { Hero } from "../hero/hero";
import { heroGainedXp } from "../../events";

export class HeroGainedXPHandler extends EventHandler {
    constructor(private hero: Hero) {
        super();
    }
    handle(event: ReturnType<typeof heroGainedXp>) {
        this.hero.gainXP(event.payload.amount);
    }
}