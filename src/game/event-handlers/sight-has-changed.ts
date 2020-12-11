import { EventHandler } from "./event-handler";
import { TileMap } from "../tilemap/tilemap";
import { Hero } from "../hero/hero";

export class SightHasChangedHandler extends EventHandler {
    constructor(private hero: Hero, private tilemap: TileMap) {
        super();
    }
    handle(event) {
        this.tilemap.computeSight({from: this.hero.pos, range: this.hero.sight});
    }
}