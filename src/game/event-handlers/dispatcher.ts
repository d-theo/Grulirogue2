import { gameBus } from "../../eventBus/game-bus";
import { Game } from "../game";
import { itemRemoved, monsterDead, heroGainedXp, rogueEvent, endRogueEvent } from "../../events";
import { HeroGainedXPHandler } from "./hero-gained-xp";
import { ItemRemovedHandler } from "./item-removed";
import { MonsterDeadHandler } from "./monster-dead";
import { sightHasChanged } from "../../events/sight-has-changed";
import { SightHasChangedHandler } from "./sight-has-changed";
import { rogueEventHandler } from "./rogue-start";
import { EndRogueEventHandler } from "./rogue-end";


export class EventDispatcher {
    constructor(private readonly game: Game) {
        this.init();
    }

    init() {
        gameBus.subscribe(itemRemoved, event => new ItemRemovedHandler(this.game.getItems()).handle(event));
        gameBus.subscribe(monsterDead, event => new MonsterDeadHandler(this.game.getMonsters()).handle(event));
        gameBus.subscribe(heroGainedXp, event => new HeroGainedXPHandler(this.game.getHero()).handle(event));
        gameBus.subscribe(sightHasChanged, event => new SightHasChangedHandler(this.game.getHero(), this.game.getTilemap()).handle(event));
        gameBus.subscribe(rogueEvent, event => new rogueEventHandler().handle(event));
        gameBus.subscribe(endRogueEvent, event => new EndRogueEventHandler().handle(event));
    }
}