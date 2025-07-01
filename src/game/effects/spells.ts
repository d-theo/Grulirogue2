import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { gameBus } from "../../eventBus/game-bus";
import { GameRange } from "../utils/range";
import { WorldEffect, BuffDefinition } from "./effect";
import { Coordinate, around } from "../utils/coordinate";
import { Item } from "../entitybase/item";
import { matrixForEach } from "../utils/matrix";
import { Tile, TileVisibility } from "../tilemap/tile";
import { Armour } from "../items/armour";
import { Weapon } from "../items/weapon";
import { BloodFountain } from "../places/places";
import { Affect } from "./affects";
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
  constructor(private readonly world: WorldEffect) { }
  cast(pos: Coordinate) {
    const bleed = new Affect("bleed").turns(3).create();
    const id = this.world.getTilemap().addTileEffects({
      debuff: () => bleed,
      pos,
      duration: 1,
      stayOnWalk: false,
      debugId: "TrapSpell",
    });
    if (id !== null) {
      gameBus.publish(
        effectSet({
          animation: "static",
          id: id,
          type: MapEffect.Spike,
          pos,
        })
      );
    }
    gameBus.publish(logPublished({ data: `trap has been set` }));
  }
}

export class RootTrapSpell implements IEffect {
  type = EffectTarget.Location;
  constructor(private readonly world: WorldEffect) { }
  cast() {
    const id = this.world.getTilemap().addTileEffects({
      debuff: () => new Affect("stun").turns(5).create(),
      pos: this.world.getHero().pos,
      duration: 1,
      stayOnWalk: false,
      debugId: "RootTrapSpell",
    });
    gameBus.publish(
      effectSet({
        animation: "static",
        id: id,
        type: MapEffect.Root,
        pos: this.world.getHero().pos,
      })
    );

    gameBus.publish(logPublished({ data: `trap has been set` }));
  }
}

export class PoisonTrapSpell implements IEffect {
  type = EffectTarget.Location;
  constructor(private readonly world: WorldEffect) { }
  cast() {
    const pos = this.world.getHero().pos;
    const poison = new Affect("poison").turns(3).create();
    const id = this.world.getTilemap().addTileEffects({
      debuff: () => poison,
      pos,
      duration: 1,
      stayOnWalk: false,
      debugId: "PoisonTrapSpell",
    });
    gameBus.publish(
      effectSet({
        animation: "static",
        id: id,
        type: MapEffect.PoisonTrap,
        pos,
      })
    );

    gameBus.publish(logPublished({ data: `trap has been set` }));
  }
}

export class WildFireSpell implements IEffect {
  type = EffectTarget.Location;
  area = 1;
  constructor(private readonly world: WorldEffect) { }
  cast(pos: Coordinate) {
    around(pos, 1).forEach((p) => {
      const dmg = new Affect("damage").params(0.5, "4-6", "wild fire").create(); // FIXME
      const id = this.world.getTilemap().addTileEffects({
        debuff: () => dmg,
        pos: p,
        duration: 10,
        stayOnWalk: true,
        debugId: "WildFireSpell",
      });
      if (id !== null) {
        gameBus.publish(
          effectSet({
            id: id,
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
  constructor(private world: WorldEffect) { }
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
  constructor() { }
  cast(item: Item) {
    item.reveal();
    gameBus.publish(
      logPublished({ level: "success", data: `You identify a ${item.name}` })
    );
  }
}

export class KnowledgeSpell implements IEffect {
  type = EffectTarget.None;
  constructor(private readonly world: WorldEffect) { }
  cast() {
    matrixForEach<Tile>(this.world.getTilemap().tiles, (t: Tile) => {
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
  constructor(private readonly world: WorldEffect) { }
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
  constructor(private readonly world: WorldEffect) { }
  cast(target: Coordinate) {
    this.world.getHero().pos = target;
    gameBus.publish(playerMoved({}));
  }
}

export class ImproveArmourSpell implements IEffect {
  type = EffectTarget.Armour;
  constructor(private world: WorldEffect) { }
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
  constructor(private world: WorldEffect) { }
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
  constructor(private readonly world: WorldEffect) { }
  cast(t: Hero | Monster) {
    new Affect("weak").turns(15).target(t).cast();
  }
}
export class SummonWeakSpell implements IEffect {
  type = EffectTarget.None;
  constructor(private readonly world: WorldEffect) { }
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
  constructor(private world: WorldEffect) { }
  cast() {
    const mobs = this.world.getNearestAttackables();
    mobs.forEach((m) => {
      new Affect("fear").turns(10).target(m).cast();
    });
  }
}

export class SacrificeSpell implements IEffect {
  type = EffectTarget.Movable;
  constructor(private world: WorldEffect) { }
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

interface ElementSpell {
  shapeStrategy: string;
  type: EffectTarget;
  affect: () => BuffDefinition;
  mapEffect: MapEffect;
  duration: number;
}

export function createElementalSpell(
  world: WorldEffect,
  builder: ElementSpell
) {
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
        const id = world.getTilemap().addTileEffects({
          debuff: builder.affect,
          pos: p,
          duration: builder.duration,
          stayOnWalk: true,
          debugId: builder.mapEffect,
        });
        if (id !== null) {
          gameBus.publish(
            effectSet({
              id: id,
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
        const id = world.getTilemap().addTileEffects({
          debuff: builder.affect,
          pos: p,
          duration: builder.duration,
          stayOnWalk: true,
          debugId: builder.mapEffect,
        });
        if (id !== null) {
          gameBus.publish(
            effectSet({
              id: id,
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
        const id = world.getTilemap().addTileEffects({
          debuff: builder.affect,
          pos: p,
          duration: builder.duration,
          stayOnWalk: true,
          debugId: builder.mapEffect,
        });
        if (id !== null) {
          gameBus.publish(
            effectSet({
              id: id,
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
    private readonly world: WorldEffect,
    private readonly strategy: Function,
    private readonly builder: ElementSpell
  ) {
    this.type = builder.type;
  }
  cast(pos: Coordinate) {
    this.strategy(pos);
  }
}
