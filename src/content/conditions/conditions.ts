import {gameBus} from "../../eventBus/game-bus";
import {itemEquiped, logPublished, playerHealed} from "../../events";
import {DamageResolution} from "../../game/fight/damages";
import {Hero} from "../../game/hero/hero";
import {Monster} from "../../game/monsters/monster";
import {pickInRange} from "../../game/utils/random";
import {SkillNames} from "../../game/hero/hero-skills";
import {AIBehavior} from "../../game/monsters/ai";
import {NullFunc} from "../../game/utils/func";
import {Affect} from "../../game/effects/affects";

export const Conditions = {
  thicc: () => ({
    onApply: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(5);
      t.speed = t.speed * 2;
      t.enchants.setAbsorb(true);
      gameBus.publish(itemEquiped({armour: t.armour}));
    },
    onRemove: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-5);
      t.speed = t.speed / 2;
      t.enchants.setAbsorb(false);
      gameBus.publish(itemEquiped({armour: t.armour}));
    },
    tags: 'thicc'
  }),
  heal: () => ({
    tick: (t: Hero) => {
      let bonus = pickInRange('10-20');
      bonus += 10 * t.heroSkills.getSkillLevel(SkillNames.Alchemist);
      t.health.take(-bonus);
      gameBus.publish(playerHealed({
        baseHp: t.health.baseHp,
        currentHp: t.health.currentHp
      }));
    },
    onApply: null,
    onRemove: NullFunc,
    tags: 'heal'
  }),
  dodge: () => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(logPublished({level: 'success', data: `${t.name} feels more agile`}));
      t.enchants.setAgile(true);
      t.dodge += this.param1
    },
    onRemove: (t: Hero | Monster) => {
      t.dodge -= this.param1
      t.enchants.setAgile(false);
    },
    tags: 'dodge'
  }),
  stun: () => ({
    start: (t: Hero | Monster) => {
      t.enchants.setStuned(true);
    },
    tick: (t: Hero | Monster) => {
      gameBus.publish(logPublished({level: 'warning', data: `${t.name} is stuned`}))
    },
    end: (t: Hero | Monster) => t.enchants.setStuned(false),
    tags: 'stun'
  }),
  blind: () => ({
    start: (t: Hero | Monster) => {
      t.enchants.setBlind(true);
      t.sight -= this.param1;
    },
    end: (t: Hero | Monster) => {
      t.enchants.setBlind(false);
      t.sight += this.param1;
    }
  }),
  wet: () => ({
    start: (t: Hero | Monster) => {
      t.enchants.setWet(true);
    },
    end: (t: Hero | Monster) => {
      t.enchants.setWet(false)
    },
    tags: 'wet'
  }),
  floral: () => ({
    start: (t: Hero | Monster) => t.enchants.setFloral(true),
    end: (t: Hero | Monster) => t.enchants.setFloral(false),
    tags: 'floral'
  }),
  accurate: () => ({
    start: (t: Hero | Monster) => {
      gameBus.publish(logPublished({level: 'success', data: `${t.name} feels more confident`}));
      t.enchants.setConfident(true);
      t.weapon.maxRange += 1;
    },
    end: (t: Hero | Monster) => {
      t.enchants.setConfident(false);
      t.weapon.maxRange -= 1
    },
  }),
  rage: ({rageLevel = pickInRange('3-5')}) => ({
    start: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-rageLevel);
      t.weapon.modifyAdditionnalDmg(rageLevel);
      t.enchants.setMoreDamage(true);
      t.enchants.setMoreVulnerable(true);
    },
    end: (t: Hero | Monster) => {
      t.enchants.setMoreDamage(false);
      t.enchants.setMoreVulnerable(false);
      t.weapon.modifyAdditionnalDmg(-rageLevel);
      t.armour.modifyAbsorb(rageLevel)
    },
  }),
  bleed: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setBleeding(true);
      gameBus.publish(
        logPublished({level: "danger", data: `${t.name} starts bleeding`})
      );
    },
    onTick: (t: Hero | Monster) => {
      new DamageResolution(null, t, 4 + t.level, "bleeding");
    },
    onRemove: (t: Hero | Monster) => t.enchants.setBleeding(false),
    tags: "bleed",
  }),
  poison: () => ({
    start: (t: Hero | Monster) => {
      gameBus.publish(logPublished({level: 'danger', data: `${t.name} feels poison in his veins`}));
      t.enchants.setPoisoned(true)
    },
    tick: (t: Hero | Monster) => {
      new DamageResolution(null, t, 2, 'poisoning');
    },
    end: (t: Hero | Monster) => t.enchants.setPoisoned(false),
    tags: 'poison'
  }),
  speed: () => ({
    start: (t: Hero | Monster) => {
      gameBus.publish(logPublished({level: 'success', data: 'you are boosted!'}));
      t.enchants.setSpeed(true);
      t.speed = t.speed / 2;
    },
    end: (t: Hero | Monster) => {
      t.enchants.setSpeed(false);
      t.speed = t.speed * 2;
    },
    tags: 'speed'
  }),
  precision: () => ({
    start: (t: Hero | Monster) => {
      gameBus.publish(logPublished({level: 'success', data: 'your eyes are stronger'}));
      t.precision += this.param1;
    },
    end: (t: Hero | Monster) => {
      t.precision -= this.param1;
    },
    tags: 'precision'
  }),
  hp: () => ({
    start: (t: Hero | Monster) => {
      t.health.getStrongerByHp(this.param1);
    },
    end: (t: Hero | Monster) => {
      t.health.getWeakerByHp(this.param1);
    },
    tags: 'hp'
  }),
  weakness: () => ({
    start: (t: Hero | Monster) => {
      t.health.getWeakerByHp(this.param1);
    },
    end: (t: Hero | Monster) => {
      t.health.getStrongerByHp(this.param1);
    },
    tags: 'weakness'
  }),
  slow: () => ({
    start: (t: Hero | Monster) => {
      gameBus.publish(logPublished({level: 'success', data: 'you are boosted!'}));
      t.enchants.setSpeed(true);
      t.speed = t.speed * 2;
    },
    end: (t: Hero | Monster) => {
      t.enchants.setSpeed(false);
      t.speed = t.speed / 2;
    },
    tags: 'slow'
  }),
  damage: ({procChance, maxDmg, cause}) => ({
    onApply: null,
    onTick: (t: Hero | Monster) => {
      if (procChance > Math.random()) return;
      const dmg = pickInRange(maxDmg);
      new DamageResolution(null, t, dmg, cause);
    },
    onRemove: NullFunc,
  }),
  shock: () => ({
    start: null,
    tick: (t: Hero | Monster) => {
      if (t.enchants.getWet()) {
        new DamageResolution(null, t, 7, 'shock');
      }
      new Affect('stun')
        .turns(1)
        .target(t)
        .cast();
      gameBus.publish(logPublished({level: 'warning', data: `${t.name} is stricken by a lightning bolt`}));
    },
    end: NullFunc,
  }),
  cold: () => ({
    start: null,
    tick: (t: Hero | Monster) => {
      new Affect('slow')
        .turns(1)
        .target(t)
        .cast();
      if (t.enchants.getWet()) {
        new Affect('stun')
          .turns(1)
          .target(t)
          .cast();
        gameBus.publish(logPublished({level: 'warning', data: `${t.name} is froze`}));
      }
    },
    end: NullFunc
  }),
  fire: () => ({
    start: (t: Hero | Monster) => {
      t.enchants.setBurned(true);
    },
    /*tick: (t: Hero|Monster) => {
        gameBus.publish(logPublished({level: 'warning', data: `${t.name} is burning`}));
        doDamages(1, t, 'burning');
    },*/
    end: (t: Hero | Monster) => {
      t.enchants.setBurned(false);
    },
    tags: 'burn'
  }),
  brave: () => ({
    start: null,
    tick: (t: Hero | Monster) => {
      if (this.param2 > Math.random()) {
        t.health.take(-this.param1);
        gameBus.publish(playerHealed({
          baseHp: t.health.baseHp,
          currentHp: t.health.currentHp
        }));
      }
    },
    end: NullFunc,
    tags: 'health'
  }),
  ac: () => ({
    start: null,
    tick: (t: Hero | Monster) => {
      if (t.health.currentHp < t.health.currentHp / 10) {
        new Affect('ac').isStackable(true).turns(1).params(5).target(t).cast();
      }
    },
    end: NullFunc
  }),
  procChance: () => ({
    start: null,
    tick: (t: Hero | Monster) => {
      if (this.param1 >= Math.random()) {
        new Affect(this.param2)
          .turns(this.param3)
          .target(t)
          .cast();
      }
    },
    end: NullFunc,
  }),
  fear: () => ({
    start: (t: Monster) => {
      t.setBehavior(AIBehavior.Fearfull());
    },
    end: (t: Monster) => {
      t.setBehavior(AIBehavior.Default());
    },
  }),
  weak: () => ({
    start: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-3)
      t.enchants.setMoreVulnerable(true);
    },
    end: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(+3);
      t.enchants.setMoreVulnerable(false);
    },
  }),
  berserk: () => ({
    start: (t: Hero | Monster) => {
      // todo fixme refacto en event ?
      t.weapon.modifyAdditionnalDmg(5);
      t.enchants.setMoreDamage(true);
    },
    end: (t: Hero | Monster) => {
      t.weapon.modifyAdditionnalDmg(-5);
      t.enchants.setMoreDamage(false);
      new Affect('weak')
        .isStackable(true)
        .turns(15)
        .target(t)
        .cast();
    },
  })
};