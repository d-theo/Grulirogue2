import { EventHandler } from "./event-handler";
import { TileMap } from "../tilemap/tilemap";
import { Hero } from "../hero/hero";
import { gameBus } from "../../eventBus/game-bus";
import { minimapUpdated } from "../../events/minimap-updated";

export class SightHasChangedHandler extends EventHandler {
    constructor(private hero: Hero, private tilemap: TileMap) {
        super();
    }
    handle(event) {
        this.tilemap.computeSight({from: this.hero.pos, range: this.hero.sight});

        const minimap = this.tilemap.getMiniMap();
        minimap[this.hero.pos.x][this.hero.pos.y] = '@';
        gameBus.publish(minimapUpdated({minimap}))
    }
}