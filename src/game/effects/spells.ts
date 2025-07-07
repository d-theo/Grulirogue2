import { gameBus } from "../../infra/events/game-bus";
import { World } from "./world-ctx";
import { Coordinate, around } from "../../utils/coordinate";
import { line } from "../tilemap/sight";
import { MapEffect } from "../../world/map/map-effect";
import { TileTrigger, TriggerType } from "../tilemap/tile-trigger";
import { effectSet } from "../events";

const short = require("short-uuid");

export enum SpellTarget {
  Location = "location",
  AoE = "AoE",
  Armour = "armour",
  Item = "item",
  Weapon = "weapon",
  Movable = "movable",
  Hero = "hero",
  None = "",
}

export interface Spell {
  type: SpellTarget;
  cast: Function;
  turns?: number;
}

interface AoESpell {
  shapeStrategy: string;
  triggerFactory: () => TileTrigger[];
  mapEffect: MapEffect;
}

export function createAoESpell(world: World, aoeSpellBuilder: AoESpell) {
  let strategy;
  switch (aoeSpellBuilder.shapeStrategy) {
    case "around":
      strategy = aroundStrategy(aoeSpellBuilder);
      break;
    case "around2":
      strategy = around2Strategy(aoeSpellBuilder);
      break;
    case "line":
      strategy = lineStategy(aoeSpellBuilder);
      break;
    default:
      throw new Error("not implemented Spell shape");
  }
  return new AreaOfEffectSpell(world, strategy, aoeSpellBuilder);

  function buildTileTriggersAt(builder: AoESpell, pos: Coordinate) {
    builder.triggerFactory().forEach((tileTrigger) => {
      const ok = world.getTilemap().addTriggerAt(pos, tileTrigger);
      if (ok) {
        gameBus.publish(
          effectSet({
            id: tileTrigger.id,
            type: builder.mapEffect,
            pos: pos,
            animation: "static",
          })
        );
      }
    });
  }

  function aroundStrategy(builder: AoESpell) {
    return (pos: Coordinate) => {
      around(pos, 1).forEach((p) => buildTileTriggersAt(builder, pos));
    };
  }

  function around2Strategy(builder: AoESpell) {
    return (pos: Coordinate) => {
      around(pos, 2).forEach((p) => buildTileTriggersAt(builder, pos));
    };
  }

  function lineStategy(builder: AoESpell) {
    return (pos: Coordinate) => {
      const l: Coordinate[] = line({ from: world.getHero().pos, to: pos });
      l.shift();
      l.forEach((p: Coordinate) => buildTileTriggersAt(builder, p));
    };
  }
}

export class AreaOfEffectSpell implements Spell {
  type: SpellTarget.Location;

  constructor(
    private readonly world: World,
    private readonly strategy: Function,
    private readonly builder: AoESpell
  ) {}

  cast(pos: Coordinate) {
    this.strategy(pos);
  }
}
