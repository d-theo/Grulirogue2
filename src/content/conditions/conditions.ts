import { gameBus } from "../../infra/events/game-bus";
import { DamageResolution } from "../../game/fight/damages";
import { Hero } from "../../game/hero/hero";
import { pickInRange } from "../../utils/random";
import { SkillNames } from "../../game/hero/hero-skills";
import { NullFunc } from "../../utils/func";
import { Buff2 } from "../../game/entitybase/buff";
import { Monster } from "../../game/entitybase/monsters/monster";
import { itemEquiped, playerHealed, logPublished } from "../../game/events";

export const Conditions = {
  thicc: () => ({
    onApply: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(5);
      t.speed = t.speed * 2;
      t.enchants.setAbsorb(+1);
      gameBus.publish(itemEquiped({ armour: t.armour }));
    },
    onRemove: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-5);
      t.speed = t.speed / 2;
      t.enchants.setAbsorb(-1);
      gameBus.publish(itemEquiped({ armour: t.armour }));
    },
    tags: "thicc",
  }),
  heal: () => ({
    onTick: (t: Hero) => {
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
    onApply: NullFunc,
    onRemove: NullFunc,
    tags: "heal",
  }),
  dodge: ({ dodgeBonus }) => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "success", data: `${t.name} feels more agile` })
      );
      t.enchants.setAgile(+1);
      t.dodge += dodgeBonus;
    },
    onRemove: (t: Hero | Monster) => {
      t.dodge -= dodgeBonus;
      t.enchants.setAgile(-1);
    },
    tags: "dodge",
  }),
  stun: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setStuned(+1);
    },
    onTick: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "warning", data: `${t.name} is stuned` })
      );
    },
    onRemove: (t: Hero | Monster) => t.enchants.setStuned(-1),
    tags: "stun",
  }),
  blind: ({ sightMalus }) => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setBlind(+1);
      t.sight -= sightMalus;
    },
    onRemove: (t: Hero | Monster) => {
      t.enchants.setBlind(-1);
      t.sight += sightMalus;
    },
  }),
  wet: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setWet(+1);
    },
    onRemove: (t: Hero | Monster) => {
      t.enchants.setWet(-1);
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
      t.enchants.setConfident(+1);
      t.weapon.maxRange += 1;
    },
    onRemove: (t: Hero | Monster) => {
      t.enchants.setConfident(-1);
      t.weapon.maxRange -= 1;
    },
  }),
  rage: ({ rageLevel = pickInRange("3-5") }) => ({
    onApply: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-rageLevel);
      t.weapon.modifyAdditionnalDmg(rageLevel);
      t.enchants.setMoreDamage(+1);
      t.enchants.setMoreVulnerable(+1);
    },
    onRemove: (t: Hero | Monster) => {
      t.enchants.setMoreDamage(-1);
      t.enchants.setMoreVulnerable(-1);
      t.weapon.modifyAdditionnalDmg(-rageLevel);
      t.armour.modifyAbsorb(rageLevel);
    },
  }),
  bleed: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setBleeding(+1);
      gameBus.publish(
        logPublished({ level: "danger", data: `${t.name} starts bleeding` })
      );
    },
    onTick: (t: Hero | Monster) => {
      new DamageResolution(null, t, 4 + t.level, "bleeding");
    },
    onRemove: (t: Hero | Monster) => t.enchants.setBleeding(-1),
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
      t.enchants.setPoisoned(+1);
    },
    onTick: (t: Hero | Monster) => {
      new DamageResolution(null, t, 2, "poisoning");
    },
    onRemove: (t: Hero | Monster) => t.enchants.setPoisoned(-1),
    tags: "poison",
  }),
  precision: ({ precisionBonus }) => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "success", data: "your eyes are stronger" })
      );
      t.precision += precisionBonus;
    },
    onRemove: (t: Hero | Monster) => {
      t.precision -= precisionBonus;
    },
    tags: "precision",
  }),
  hp: ({ bonusHp }) => ({
    onApply: (t: Hero | Monster) => {
      t.health.getStrongerByHp(bonusHp);
    },
    onRemove: (t: Hero | Monster) => {
      t.health.getWeakerByHp(bonusHp);
    },
    tags: "hp",
  }),
  weakness: ({ hpWeaker: malusHp }) => ({
    onApply: (t: Hero | Monster) => {
      t.health.getWeakerByHp(malusHp);
    },
    onRemove: (t: Hero | Monster) => {
      t.health.getStrongerByHp(malusHp);
    },
    tags: "weakness",
  }),
  speed: () => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "success", data: "you are boosted!" })
      );
      t.enchants.setSpeed(+1);
      t.speed = t.speed * 2;
    },
    onRemove: (t: Hero | Monster) => {
      t.enchants.setSpeed(-1);
      t.speed = t.speed / 2;
    },
    tags: "speed",
  }),
  slow: () => ({
    onApply: (t: Hero | Monster) => {
      gameBus.publish(
        logPublished({ level: "warning", data: "you feel tired" })
      );
      t.enchants.setSlow(+1);
      t.speed = t.speed / 2;
    },
    onRemove: (t: Hero | Monster) => {
      t.enchants.setSlow(-1);
      t.speed = t.speed * 2;
    },
    tags: "slow",
  }),
  // FIX ME => does not belong here right !?
  damage: ({ procChance, dmgRange, cause }) => ({
    onApply: null,
    onTick: (t: Hero | Monster) => {
      if (procChance > Math.random()) return;
      const dmg = pickInRange(dmgRange);
      new DamageResolution(null, t, dmg, cause);
    },
    onRemove: NullFunc,
  }),
  shock: () => ({
    onApply: null,
    onTick: (t: Hero | Monster) => {
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
    onRemove: NullFunc,
  }),
  cold: () => ({
    onApply: Conditions.cold().onApply,
    onTick: (t: Hero | Monster) => {
      if (t.enchants.getWet()) {
        t.addBuff(Buff2.create(Conditions.stun).setTurns(1));
        gameBus.publish(
          logPublished({ level: "warning", data: `${t.name} is froze` })
        );
      }
    },
    onRemove: Conditions.cold().onRemove,
  }),
  fire: () => ({
    onApply: (t: Hero | Monster) => {
      t.enchants.setBurned(+1);
    },
    // TODO do it!!
    /*tick: (t: Hero|Monster) => {
        gameBus.publish(logPublished({level: 'warning', data: `${t.name} is burning`}));
        doDamages(1, t, 'burning');
    },*/
    onRemove: (t: Hero | Monster) => {
      t.enchants.setBurned(-1);
    },
    tags: "burn",
  }),
  health: ({ amount, procChance }) => ({
    onApply: null,
    onTick: (t: Hero | Monster) => {
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
    onRemove: NullFunc,
    tags: "health",
  }),
  // TODO add affliction ?
  brave: () => ({
    onApply: (t: Hero | Monster) => t.armour.modifyAbsorb(5),
    onTick: NullFunc,
    onRemove: (t: Hero | Monster) => t.armour.modifyAbsorb(-5),
  }),
  ac: ({ absorb }) => ({
    onApply: (t: Hero | Monster) => t.armour.modifyAbsorb(absorb),
    onTick: NullFunc,
    onRemove: (t: Hero | Monster) => t.armour.modifyAbsorb(-absorb),
  }),
  // TODO refacto pour Enchantement ?
  procChance: ({ proc, condition, turns }) => ({
    onApply: null,
    onTick: (t: Hero | Monster) => {
      if (proc >= Math.random()) {
        t.addBuff(Buff2.create(condition).setTurns(turns));
      }
    },
    onRemove: NullFunc,
  }),
  fear: () => ({
    onApply: (t: Monster) => {
      t.setBehavior("fearfull");
    },
    onRemove: (t: Monster) => {
      t.setBehavior("default");
    },
  }),
  weak: () => ({
    onApply: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(-3);
      t.enchants.setMoreVulnerable(+1);
    },
    onRemove: (t: Hero | Monster) => {
      t.armour.modifyAbsorb(+3);
      t.enchants.setMoreVulnerable(-1);
    },
  }),
  berserk: () => ({
    onApply: (t: Hero | Monster) => {
      t.weapon.modifyAdditionnalDmg(5);
      t.enchants.setMoreDamage(+1);
    },
    onRemove: (t: Hero | Monster) => {
      t.weapon.modifyAdditionnalDmg(-5);
      t.enchants.setMoreDamage(-1);
      t.addBuff(
        Buff2.create(Conditions.weak).setIsStackable(true).setTurns(15)
      );
    },
  }),
};
