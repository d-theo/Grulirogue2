import { gameBus } from "../../infra/events/game-bus";
import { Entity } from "../entitybase/entity";
import { effectUnset } from "../events";
import { Tile } from "./tile";

export enum TriggerType {
  OnWalk,
  OnLeft,
}
export type TriggerAction = (target: Entity) => void;
export type TileTrigger = {
  id: string;
  turns: number;
  trigger: TriggerAction;
  stayOnWalk: boolean;
  triggerType: TriggerType;
};
export class TileTriggers {
  onWalkTriggers: TileTrigger[] = [];
  onLeftTriggers: TileTrigger[] = [];
  tile: Tile;

  constructor(tile: Tile) {
    this.tile = tile;
  }

  public add(trigger: TileTrigger) {
    if (trigger.triggerType === TriggerType.OnWalk)
      this.onWalkTriggers.push(trigger);
    if (trigger.triggerType === TriggerType.OnLeft)
      this.onLeftTriggers.push(trigger);
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

  public onEntityLeft(entity: Entity) {
    const idsToRemove: string[] = [];

    for (const trigger of this.onLeftTriggers) {
      trigger.trigger(entity);
      if (!trigger.stayOnWalk) {
        idsToRemove.push(trigger.id);
      }
    }

    if (idsToRemove.length > 0) {
      this.onLeftTriggers = this.onLeftTriggers.filter(
        (t) => !idsToRemove.includes(t.id)
      );
    }
  }
}
