import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus } from "../../eventBus/game-bus";
import { GameRange } from "../utils/range";
import { World } from "./effect";
import { Coordinate, around } from "../utils/coordinate";
import { Item } from "../entitybase/item";
import { matrixForEach } from "../utils/matrix";
import { Tile, TileVisibility } from "../tilemap/tile";
import { Armour } from "../items/armour";
import { Weapon } from "../items/weapon";
import { BloodFountain } from "../places/places";
import { line } from "../tilemap/sight";
import { DamageResolution } from "../fight/damages";
import {
  effectSet,
  logPublished,
  sightUpdated,
  playerMoved,
  itemEquiped,
  heroGainedXp,
  rogueEvent,
  endRogueEvent,
  monsterSpawned,
} from "../../events";
import { Bestiaire } from "../monsters/bestiaire";
import { MapEffect } from "../../world/map/map-effect";
import { Entity } from "../entitybase/entity";
import { Buff2 } from "../entitybase/buff";
import { Conditions } from "../../content/conditions/conditions";
import { TriggerType } from "../tilemap/tile-trigger";
const short = require("short-uuid");

export enum EffectTarget {
  Location = "location",
  AoE = "AoE",
  Armour = "armour",
  Item = "item",
  Weapon = "weapon",
  Movable = "movable",
  Hero = "hero",
  None = "",
}

export interface IEffect {
  type: EffectTarget;
  cast: Function;
  turns?: number;
}

export class TrapSpell implements IEffect {
  type = EffectTarget.Location;

  constructor(private readonly world: World) {}

  cast(pos: Coordinate) {
    const trigger = {
      triggerType: TriggerType.OnWalk,
      id: short.generate(),
      stayOnWalk: false,
      turns: Infinity,
      trigger: (target: Entity) => {
        target.addBuff(Buff2.create(Conditions.bleed).setTurns(3));
      },
    };

    const ok = this.world.getTilemap().addTriggerAt(pos, trigger);

    if (ok) {
      gameBus.publish(
        effectSet({
          animation: "static",
          id: trigger.id,
          type: MapEffect.Spike,
          pos,
        })
      );
      gameBus.publish(logPublished({ data: `trap has been set` }));
    }
  }
}

export class RootTrapSpell implements IEffect {
  type = EffectTarget.Location;

  constructor(private readonly world: World) {}

  cast() {
    const trigger = {
      triggerType: TriggerType.OnWalk,
      id: short.generate(),
      stayOnWalk: false,
      turns: Infinity,
      trigger: (target: Entity) => {
        target.addBuff(Buff2.create(Conditions.stun).setTurns(5));
      },
    };

    const ok = this.world
      .getTilemap()
      .addTriggerAt(this.world.getHero().pos, trigger);
    if (ok) {
      gameBus.publish(
        effectSet({
          animation: "static",
          id: trigger.id,
          type: MapEffect.Root,
          pos: this.world.getHero().pos,
        })
      );

      gameBus.publish(logPublished({ data: `trap has been set` }));
    }
  }
}

export class PoisonTrapSpell implements IEffect {
  type = EffectTarget.Location;

  constructor(private readonly world: World) {}

  cast() {
    const trigger = {
      triggerType: TriggerType.OnWalk,
      id: short.generate(),
      stayOnWalk: false,
      turns: Infinity,
      trigger: (target: Entity) => {
        target.addBuff(Buff2.create(Conditions.poison).setTurns(3));
      },
    };
    const ok = this.world
      .getTilemap()
      .addTriggerAt(this.world.getHero().pos, trigger);
    if (ok) {
      gameBus.publish(
        effectSet({
          animation: "static",
          id: trigger.id,
          type: MapEffect.PoisonTrap,
          pos: this.world.getHero().pos,
        })
      );

      gameBus.publish(logPublished({ data: `trap has been set` }));
    }
  }
}

export class WildFireSpell implements IEffect {
  type = EffectTarget.Location;
  area = 1;

  constructor(private readonly world: World) {}

  cast(pos: Coordinate) {
    around(pos, 1).forEach((p) => {
      const trigger = {
        triggerType: TriggerType.OnWalk,
        id: short.generate(),
        stayOnWalk: true,
        turns: 10,
        trigger: (target: Entity) => {
          // fixme direct effect
          target.addBuff(
            Buff2.create(() =>
              Conditions.damage({
                procChance: 0.5,
                dmgRange: "4-6",
                cause: "wild fire",
              })
            ).setTurns(1)
          );
        },
      };
      const ok = this.world
        .getTilemap()
        .addTriggerAt(this.world.getHero().pos, trigger);
      if (ok) {
        gameBus.publish(
          effectSet({
            id: trigger.id,
            type: MapEffect.Fire,
            pos: p,
            animation: "static",
          })
        );
      }
    });
  }
}

export class UnholySpellBook implements IEffect {
  type = EffectTarget.None;
  turns = 1;

  constructor(private world: World) {}

  cast() {
    const hpos = this.world.getHero().pos;
    const place = this.world.getPlaces().getAt(hpos);

    if (place != null && place instanceof BloodFountain) {
      gameBus.publish(
        logPublished({
          level: "warning",
          data: `The blood inside the fountain is bubbling !!`,
        })
      );
      place.cursed = false;
    } else {
      new DamageResolution(null, this.world.getHero(), 1, "sickness");
      gameBus.publish(
        logPublished({
          level: "warning",
          data: `Reading this book is making you nauseous`,
        })
      );
    }
  }
}

export class IdentifiySpell implements IEffect {
  type = EffectTarget.Item;

  constructor() {}

  cast(item: Item) {
    item.reveal();
    gameBus.publish(
      logPublished({ level: "success", data: `You identify a ${item.name}` })
    );
  }
}

export class KnowledgeSpell implements IEffect {
  type = EffectTarget.None;

  constructor(private readonly world: World) {}

  cast() {
    this.world.getTilemap().forEachTile((t: Tile) => {
      t.viewed = true;
      if (t.visibility !== TileVisibility.OnSight) t.setObscurity();
    });
    gameBus.publish(
      logPublished({ level: "success", data: "Yee see everything !" })
    );
    gameBus.publish(sightUpdated({}));
  }
}

export class TeleportationSpell implements IEffect {
  type = EffectTarget.Movable;

  constructor(private readonly world: World) {}

  cast(target: Hero | Monster) {
    let done = false;
    const rX = new GameRange(0, this.world.getMapWidth());
    const rY = new GameRange(0, this.world.getMapHeight());
    while (!done) {
      const pos = {
        x: rX.pick(),
        y: rY.pick(),
      };
      if (this.world.tileIsEmpty(pos) && this.world.monsterAt(pos) == null) {
        done = true;
        target.pos = pos;
      }
    }
  }
}

export class BlinkSpell implements IEffect {
  type = EffectTarget.Location;

  constructor(private readonly world: World) {}

  cast(target: Coordinate) {
    this.world.getHero().pos = target;
    gameBus.publish(playerMoved({}));
  }
}

export class ImproveArmourSpell implements IEffect {
  type = EffectTarget.Armour;

  constructor(private world: World) {}

  cast(target: Armour) {
    target.addAbsorbEnchant(1);
    gameBus.publish(
      logPublished({
        data: `Your ${target.name} glows magically for a moment.`,
      })
    );
    gameBus.publish(itemEquiped({ armour: this.world.getHero().armour }));
  }
}

export class ImproveWeaponSpell implements IEffect {
  type = EffectTarget.Weapon;

  constructor(private world: World) {}

  cast(target: Weapon) {
    target.modifyAdditionnalDmg(+1);
    gameBus.publish(
      logPublished({
        data: `Your ${target.name} glows magically for a moment.`,
      })
    );
    gameBus.publish(itemEquiped({ weapon: this.world.getHero().weapon }));
  }
}

export class WeaknessSpell implements IEffect {
  type = EffectTarget.Movable;

  constructor(private readonly world: World) {}

  cast(t: Entity) {
    t.addBuff(Buff2.create(Conditions.slow).setTurns(15));
  }
}

export class SummonWeakSpell implements IEffect {
  type = EffectTarget.None;

  constructor(private readonly world: World) {}

  cast() {
    const pos = this.world.getHero().pos;
    const mobs = [
      Bestiaire.Greece.Bat,
      Bestiaire.Greece.Rat,
      Bestiaire.Greece.Rat,
    ];
    for (let i = 0; i < 3; i++) {
      const posMob = this.world.nearestEmptyTileFrom(pos);
      const friend = Monster.makeMonster({
        ...mobs[i],
        pos: { x: posMob.x, y: posMob.y },
      }).setAligment("good");
      this.world.addMonster(friend);
      gameBus.publish(monsterSpawned({ monster: friend }));
    }
  }
}

/// SHOULD BE SPELLS
export class CleaningEffect implements IEffect {
  type = EffectTarget.Movable;

  cast(target: Hero | Monster) {
    target.buffs.cleanBuff();
    target.enchants.clean();
    gameBus.publish(
      logPublished({ level: "success", data: `${target.name} looks purified` })
    );
  }
}

export class XPEffect implements IEffect {
  type = EffectTarget.Movable;

  cast(target: Hero | Monster) {
    if (target instanceof Hero) {
      gameBus.publish(
        heroGainedXp({
          amount: 999999,
        })
      );
      gameBus.publish(
        logPublished({ level: "success", data: "you are wiser !" })
      );
    } else {
      gameBus.publish(logPublished({ data: "nothing happens" }));
    }
  }
}

export class RogueEventSpell implements IEffect {
  type = EffectTarget.None;

  cast() {
    gameBus.publish(rogueEvent({}));
    gameBus.publish(
      logPublished({ level: "danger", data: "where the heck are you ?!" })
    );
  }
}

export class RealityEventSpell implements IEffect {
  type = EffectTarget.None;

  cast() {
    gameBus.publish(endRogueEvent({}));
    gameBus.publish(
      logPublished({ level: "success", data: "Yeah, back to the quest !" })
    );
  }
}

export class FearSpell implements IEffect {
  type = EffectTarget.None;

  constructor(private world: World) {}

  cast() {
    const mobs = this.world.getNearestAttackables();
    mobs.forEach((m) => {
      m.addBuff(Buff2.create(Conditions.fear).setTurns(10));
    });
  }
}

export class SacrificeSpell implements IEffect {
  type = EffectTarget.Movable;

  constructor(private world: World) {}

  cast(t: Hero | Monster) {
    const hero = this.world.getHero();
    const sacrifice = Math.floor(hero.health.baseHp * 0.25);
    const curse = Math.floor(t.health.baseHp * 0.5);
    const target = t;
    hero.health.getWeakerByHp(sacrifice);
    target.health.getWeakerByHp(curse);
    gameBus.publish(
      logPublished({
        level: "danger",
        data: `You used a forbidden blood magic, hoping this sacrifice is worth the price...`,
      })
    );
    new DamageResolution(null, t, curse, "sacrifice");
    new DamageResolution(null, hero, sacrifice, "sacrifice");
  }
}

export class AsservissementSpell implements IEffect {
  type = EffectTarget.Movable;

  cast(target: Hero | Monster) {
    if (target instanceof Hero) {
      gameBus.publish(logPublished({ data: `You cannot do that` }));
      return;
    }

    target.setAligment("good");
  }
}

/* refacto this : builder and naming are not good !! 

EG : 

    case SpellNames.Shadow:
      return createElementalSpell(world, {
        shapeStrategy: "around2",
        type: EffectTarget.Location,
        spell: () => new Affect("blind").params(7).create(),
        mapEffect: MapEffect.Shadow,
        duration: 40,
      });

      return AoESpell(world, {
        shape:'',
        //type: EffectTarget.Location, ?
        spell: () => 
      })

      */

/* AoE Spells */
interface ElementSpell {
  shapeStrategy: string;
  type: EffectTarget;
  spell: () => Buff2;
  mapEffect: MapEffect;
  duration: number;
}

export function createElementalSpell(world: World, builder: ElementSpell) {
  let strategy;
  switch (builder.shapeStrategy) {
    case "around":
      strategy = aroundStrategy(builder);
      break;
    case "around2":
      strategy = around2Strategy(builder);
      break;
    case "line":
      strategy = lineStategy(builder);
      break;
    default:
      throw new Error("not implemented Spell shape");
  }
  return new ElementalSpell(world, strategy, builder);

  function aroundStrategy(builder: ElementSpell) {
    return (pos: Coordinate) => {
      around(pos, 1).forEach((p) => {
        const trigger = {
          triggerType: TriggerType.OnWalk,
          id: short.generate(),
          stayOnWalk: true,
          turns: builder.duration,
          trigger: builder.spell,
        };

        const ok = world.getTilemap().addTriggerAt(p, trigger);

        if (ok) {
          gameBus.publish(
            effectSet({
              id: trigger.id,
              type: builder.mapEffect,
              pos: p,
              animation: "static",
            })
          );
        }
      });
    };
  }

  function around2Strategy(builder: ElementSpell) {
    return (pos: Coordinate) => {
      around(pos, 2).forEach((p) => {
        const trigger = {
          triggerType: TriggerType.OnWalk,
          id: short.generate(),
          stayOnWalk: true,
          turns: builder.duration,
          trigger: builder.spell,
        };

        const ok = world.getTilemap().addTriggerAt(p, trigger);

        if (ok) {
          gameBus.publish(
            effectSet({
              id: trigger.id,
              type: builder.mapEffect,
              pos: p,
              animation: "static",
            })
          );
        }
      });
    };
  }

  function lineStategy(builder: ElementSpell) {
    return (pos: Coordinate) => {
      const l: Coordinate[] = line({ from: world.getHero().pos, to: pos });
      l.shift();
      l.forEach((p: Coordinate) => {
        const trigger = {
          triggerType: TriggerType.OnWalk,
          id: short.generate(),
          stayOnWalk: true,
          turns: builder.duration,
          trigger: builder.spell,
        };

        const ok = world.getTilemap().addTriggerAt(p, trigger);

        if (ok) {
          gameBus.publish(
            effectSet({
              id: trigger.id,
              type: builder.mapEffect,
              pos: p,
              animation: "static",
            })
          );
        }
      });
    };
  }
}

export class ElementalSpell {
  type: EffectTarget;

  constructor(
    private readonly world: World,
    private readonly strategy: Function,
    private readonly builder: ElementSpell
  ) {
    this.type = builder.type;
  }

  cast(pos: Coordinate) {
    this.strategy(pos);
  }
}
