import { Entity } from "../entitybase/entity";
import { Coordinate } from "../utils/coordinate";
import { TileTrigger, TileTriggers } from "./tile-trigger";

export enum TileVisibility {
  Unknown = -1,
  OnSight = 0,
  Hidden = 1,
  Far = 2,
}

export class Tile {
  pos: Coordinate;
  visibility: TileVisibility;
  type: number[];
  viewed = false;
  isSolidFct: (n: number) => boolean;
  isWalkableFct: (n: number) => boolean;
  isEntry = false;
  isExit = false;
  private tileTriggers: TileTriggers;

  constructor(arg: {
    x: number;
    y: number;
    visibility?: TileVisibility;
    type?: number;
    isSolidFct: (n: number) => boolean;
    isWalkableFct: (n: number) => boolean;
  }) {
    this.pos = { x: arg.x, y: arg.y };
    this.visibility = arg.visibility || TileVisibility.Hidden;
    this.type = [];
    this.isSolidFct = arg.isSolidFct;
    this.isWalkableFct = arg.isWalkableFct;
    this.tileTriggers = new TileTriggers(this);
  }

  isType(tileType: number) {
    return this.type.some((t) => t === tileType);
  }

  isSolid() {
    return this.type.some((t) => this.isSolidFct(t));
  }

  isWalkable() {
    return this.type.every((t) => this.isWalkableFct(t));
  }

  isEmpty() {
    return this.type.every((t) => this.isWalkableFct(t));
  }

  isOpenDoor() {
    return;
  }

  addTrigger(trigger: TileTrigger) {
    if (!this.isSolid()) {
      this.tileTriggers.add(trigger);
      return true;
    }
    return false;
  }

  updateTriggers() {
    this.tileTriggers.update();
  }

  on(event: "walked" | "left", entity: Entity) {
    if (event === "walked") {
      this.tileTriggers.onEntityWalked(entity);
    }
    if (event === "left") {
      this.tileTriggers.onEntityLeft(entity);
    }
  }

  setObscurity() {
    if (this.viewed) {
      this.visibility = TileVisibility.Far;
    } else {
      this.visibility = TileVisibility.Hidden;
    }
  }

  setOnSight() {
    this.visibility = TileVisibility.OnSight;
    this.viewed = true;
  }
}
