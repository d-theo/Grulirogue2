import { Coordinate } from "../utils/coordinate";
import { ItemVisitor } from "../items/item-visitor";
import { gameBus } from "../../eventBus/game-bus";
import { Hero } from "../hero/hero";
import { EffectTarget } from "../effects/spells";
import { itemDropped } from "../../events";
let short = require("short-uuid");

export interface ItemArgument {
  getArgumentForKey(key: string): EffectTarget;
}

export abstract class Item implements ItemArgument {
  id = short.generate();
  _name: string;
  _description: string;
  pos: Coordinate | null;
  skin: string;
  keyMapping: any = {};
  keyDescription: any = {};
  isConsumable = true;
  identified = true;
  constructor(arg: {
    x?: number;
    y?: number;
    name?: string;
    description?: string;
    skin?: string;
  }) {
    this.pos = {
      x: arg.x || 0,
      y: arg.y || 0,
    };
    this._description = arg.description || "";
    this._name = arg.name || "";
    this.skin = arg.skin || "hero";
    this.keyMapping["d"] = this.drop.bind(this);
    this.keyDescription["d"] = "(d)rop";
  }
  abstract use(args: any): any;
  abstract visit(itemVisitor: ItemVisitor): any;
  drop(target: Hero) {
    target.dropItem(this);
    gameBus.publish(
      itemDropped({
        item: this,
      })
    );
  }
  get name() {
    return this._name;
  }
  abstract reveal(): void;
  getArgumentForKey(key: string) {
    return EffectTarget.None;
  }
}
