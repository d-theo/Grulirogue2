import { gameBus } from "../../eventBus/game-bus";
import { Game } from "../game";
import { EventHandler } from "./event-handler";
import { itemRemoved, monsterDead, heroGainedXp } from "../../events";
import { PlayerAttemptAttackMonsterHandler } from "../command-handlers/player-attack";
import { PlayerActionMoveHandler } from "../command-handlers/player-move";
import { Hero } from "../hero/hero";
import { HeroGainedXPHandler } from "./hero-gained-xp";
import { ItemRemovedHandler } from "./item-removed";
import { MonsterDeadHandler } from "./monster-dead";
import { sightHasChanged } from "../../events/sight-has-changed";
import { SightHasChangedHandler } from "./sight-has-changed";


export class EventDispatcher {
    constructor(private readonly game: Game) {
        this.init();
    }

    init() {
        gameBus.subscribe(itemRemoved, event => new ItemRemovedHandler(this.game.getItems()).handle(event));
        gameBus.subscribe(monsterDead, event => new MonsterDeadHandler(this.game.getMonsters()).handle(event));
        gameBus.subscribe(heroGainedXp, event => new HeroGainedXPHandler(this.game.getHero()).handle(event));
        gameBus.subscribe(sightHasChanged, event => new SightHasChangedHandler(this.game.getHero(), this.game.getTilemap()).handle(event));
    }
}