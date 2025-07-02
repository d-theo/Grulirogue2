import { gameBus } from "../../eventBus/game-bus";
import { itemEquiped, logPublished, playerHealed } from "../../events";
import { DamageResolution } from "../../game/fight/damages";
import { Hero } from "../../game/hero/hero";
import { Monster } from "../../game/monsters/monster";
import { pickInRange } from "../../game/utils/random";
import { SkillNames } from "../../game/hero/hero-skills";
import { AIBehavior } from "../../game/monsters/ai";
import { NullFunc } from "../../game/utils/func";
import { Buff2 } from "../../game/entitybase/buff";

export const Conditions = {
  thicc: () => ({
    onApply: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(5);
      t.speed = t.speed * 2;
      t.enchants.setAbsorb(true);
      gameBus.publish(itemEquiped({ armour: t.armour }));
    },
    onRemove: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-5);
      t.speed = t.speed / 2;
      t.enchants.setAbsorb(false);
      gameBus.publish(itemEquiped({ armour: t.armour }));
    },
    tags: "thicc",
  }),
  heal: () => ({
    tick: (t: Hero) => {
      let bonus = pickInRange("10-20");
      bonus += 10 * t.heroSkills.getSkillLevel(SkillNames.Alchemist);
      t.health.take(-bonus);
      gameBus.publish(
        playerHealed({
          baseHp: t.health.baseHp,
          currentHp: t.health.currentHp,
        })
      );
    },
    onApply: null,
    onRemove: NullFunc,
    tags: "heal",
  }),
  dodge: ({ dodgeBonus }) => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "success", data: `${t.name} feels more agile` })
      );
      t.enchants.setAgile(true);
      t.dodge += dodgeBonus;
    },
    onRemove: (t: Hero | Monster) => {
      t.dodge -= dodgeBonus;
      t.enchants.setAgile(false);
    },
    tags: "dodge",
  }),
  stun: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setStuned(true);
    },
    tick: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "warning", data: `${t.name} is stuned` })
      );
    },
    end: (t: Hero | Monster) => t.enchants.setStuned(false),
    tags: "stun",
  }),
  blind: ({ sightMalus }) => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setBlind(true);
      t.sight -= sightMalus;
    },
    end: (t: Hero | Monster) => {
      t.enchants.setBlind(false);
      t.sight += sightMalus;
    },
  }),
  wet: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setWet(true);
    },
    end: (t: Hero | Monster) => {
      t.enchants.setWet(false);
    },
    tags: "wet",
  }),
  accurate: () => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({
          level: "success",
          data: `${t.name} feels more confident`,
        })
      );
      t.enchants.setConfident(true);
      t.weapon.maxRange += 1;
    },
    end: (t: Hero | Monster) => {
      t.enchants.setConfident(false);
      t.weapon.maxRange -= 1;
    },
  }),
  rage: ({ rageLevel = pickInRange("3-5") }) => ({
    onApply: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-rageLevel);
      t.weapon.modifyAdditionnalDmg(rageLevel);
      t.enchants.setMoreDamage(true);
      t.enchants.setMoreVulnerable(true);
    },
    end: (t: Hero | Monster) => {
      t.enchants.setMoreDamage(false);
      t.enchants.setMoreVulnerable(false);
      t.weapon.modifyAdditionnalDmg(-rageLevel);
      t.armour.modifyAbsorb(rageLevel);
    },
  }),
  bleed: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setBleeding(true);
      gameBus.publish(
        logPublished({ level: "danger", data: `${t.name} starts bleeding` })
      );
    },
    onTick: (t: Hero | Monster) => {
      new DamageResolution(null, t, 4 + t.level, "bleeding");
    },
    onRemove: (t: Hero | Monster) => t.enchants.setBleeding(false),
    tags: "bleed",
  }),
  poison: () => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({
          level: "danger",
          data: `${t.name} feels poison in his veins`,
        })
      );
      t.enchants.setPoisoned(true);
    },
    tick: (t: Hero | Monster) => {
      new DamageResolution(null, t, 2, "poisoning");
    },
    end: (t: Hero | Monster) => t.enchants.setPoisoned(false),
    tags: "poison",
  }),
  precision: ({ precisionBonus }) => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "success", data: "your eyes are stronger" })
      );
      t.precision += precisionBonus;
    },
    end: (t: Hero | Monster) => {
      t.precision -= precisionBonus;
    },
    tags: "precision",
  }),
  hp: ({ bonusHp }) => ({
    onApply: (t: Hero | Monster) => {
      t.health.getStrongerByHp(bonusHp);
    },
    end: (t: Hero | Monster) => {
      t.health.getWeakerByHp(bonusHp);
    },
    tags: "hp",
  }),
  weakness: ({ hpWeaker: malusHp }) => ({
    onApply: (t: Hero | Monster) => {
      t.health.getWeakerByHp(malusHp);
    },
    end: (t: Hero | Monster) => {
      t.health.getStrongerByHp(malusHp);
    },
    tags: "weakness",
  }),
  speed: () => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "success", data: "you are boosted!" })
      );
      t.enchants.setSpeed(true);
      t.speed = t.speed * 2;
    },
    end: (t: Hero | Monster) => {
      t.enchants.setSpeed(false);
      t.speed = t.speed / 2;
    },
    tags: "speed",
  }),
  slow: () => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "warning", data: "you feel tired" })
      );
      t.enchants.setSlow(true);
      t.speed = t.speed / 2;
    },
    end: (t: Hero | Monster) => {
      t.enchants.setSpeed(false);
      t.speed = t.speed * 2;
    },
    tags: "slow",
  }),
  damage: ({ procChance, maxDmg, cause }) => ({
    onApply: null,
    onTick: (t: Hero | Monster) => {
      if (procChance > Math.random()) return;
      const dmg = pickInRange(maxDmg);
      new DamageResolution(null, t, dmg, cause);
    },
    onRemove: NullFunc,
  }),
  shock: () => ({
    onApply: null,
    tick: (t: Hero | Monster) => {
      if (t.enchants.getWet()) {
        new DamageResolution(null, t, 7, "shock");
      }
      t.addBuff(Buff2.create(Conditions.stun).setTurns(1));
      gameBus.publish(
        logPublished({
          level: "warning",
          data: `${t.name} is stricken by a lightning bolt`,
        })
      );
    },
    end: NullFunc,
  }),
  cold: () => ({
    onApply: Conditions.cold().onApply,
    tick: (t: Hero | Monster) => {
      if (t.enchants.getWet()) {
        t.addBuff(Buff2.create(Conditions.stun).setTurns(1));
        gameBus.publish(
          logPublished({ level: "warning", data: `${t.name} is froze` })
        );
      }
    },
    end: Conditions.cold().onRemove,
  }),
  fire: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setBurned(true);
    },
    // TODO do it!!
    /*tick: (t: Hero|Monster) => {
        gameBus.publish(logPublished({level: 'warning', data: `${t.name} is burning`}));
        doDamages(1, t, 'burning');
    },*/
    end: (t: Hero | Monster) => {
      t.enchants.setBurned(false);
    },
    tags: "burn",
  }),
  health: ({ amount, procChance }) => ({
    onApply: null,
    tick: (t: Hero | Monster) => {
      if (procChance > Math.random()) {
        t.health.take(-amount);
        // TODO here is the place for event?
        gameBus.publish(
          playerHealed({
            baseHp: t.health.baseHp,
            currentHp: t.health.currentHp,
          })
        );
      }
    },
    end: NullFunc,
    tags: "health",
  }),
  // TODO add affliction ?
  brave: () => ({
    onApply: (t: Hero | Monster) => t.armour.modifyAbsorb(5),
    tick: NullFunc,
    end: (t: Hero | Monster) => t.armour.modifyAbsorb(-5),
  }),
  ac: ({ absorb }) => ({
    onApply: (t: Hero | Monster) => t.armour.modifyAbsorb(absorb),
    tick: NullFunc,
    end: (t: Hero | Monster) => t.armour.modifyAbsorb(-absorb),
  }),
  // TODO refacto pour Enchantement ?
  procChance: ({ proc, condition, turns }) => ({
    onApply: null,
    tick: (t: Hero | Monster) => {
      if (proc >= Math.random()) {
        t.addBuff(Buff2.create(condition).setTurns(turns));
      }
    },
    end: NullFunc,
  }),
  fear: () => ({
    onApply: (t: Monster) => {
      t.setBehavior(AIBehavior.Fearfull());
    },
    end: (t: Monster) => {
      t.setBehavior(AIBehavior.Default());
    },
  }),
  weak: () => ({
    onApply: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-3);
      t.enchants.setMoreVulnerable(true);
    },
    end: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(+3);
      t.enchants.setMoreVulnerable(false);
    },
  }),
  berserk: () => ({
    onApply: (t: Hero | Monster) => {
      t.weapon.modifyAdditionnalDmg(5);
      t.enchants.setMoreDamage(true);
    },
    end: (t: Hero | Monster) => {
      t.weapon.modifyAdditionnalDmg(-5);
      t.enchants.setMoreDamage(false);
      t.addBuff(
        Buff2.create(Conditions.weak).setIsStackable(true).setTurns(15)
      );
    },
  }),
};
