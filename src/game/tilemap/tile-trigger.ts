import { gameBus } from "../../eventBus/game-bus";
import { effectUnset } from "../../events";
import { Entity } from "../entitybase/entity";
import { Tile } from "./tile";

export type TriggerAction = (target: Entity) => void;
export type TileTrigger = {
  id: string;
  turns: number;
  trigger: TriggerAction;
  stayOnWalk: boolean;
  triggerType: "onWalk" | "onLeft";
};
export class TileTriggers {
  onWalkTriggers: TileTrigger[] = [];
  onLeftTriggers: TileTrigger[] = [];
  tile: Tile;

  constructor(tile: Tile) {
    this.tile = tile;
  }

  public add(trigger: TileTrigger) {
    if (trigger.triggerType === "onWalk") this.onWalkTriggers.push(trigger);
    if (trigger.triggerType === "onLeft") this.onLeftTriggers.push(trigger);
  }

  public update() {
    this.onWalkTriggers = this.onWalkTriggers.filter((trigger) => {
      if (trigger.turns > 0) {
        trigger.turns -= 1;
        return true;
      }
      gameBus.publish(effectUnset({ id: trigger.id }));
      return false;
    });
    this.onLeftTriggers = this.onLeftTriggers.filter((trigger) => {
      if (trigger.turns > 0) {
        trigger.turns -= 1;
        return true;
      }
      gameBus.publish(effectUnset({ id: trigger.id }));
      return false;
    });
  }

  public onEntityWalked(entity: Entity) {
    const idsToRemove: string[] = [];

    for (const trigger of this.onWalkTriggers) {
      trigger.trigger(entity);
      if (!trigger.stayOnWalk) {
        idsToRemove.push(trigger.id);
      }
    }

    if (idsToRemove.length > 0) {
      this.onWalkTriggers = this.onWalkTriggers.filter(
        (t) => !idsToRemove.includes(t.id)
      );
    }
  }

  public onEntitLeft(entity: Entity) {
    const idsToRemove: string[] = [];

    for (const trigger of this.onLeftTriggers) {
      trigger.trigger(entity);
      if (!trigger.stayOnWalk) {
        idsToRemove.push(trigger.id);
      }
    }

    if (idsToRemove.length > 0) {
      this.onWalkTriggers = this.onWalkTriggers.filter(
        (t) => !idsToRemove.includes(t.id)
      );
    }
  }
}
