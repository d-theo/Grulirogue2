import { Hero } from "./hero";
import { EffectMaker, SpellNames } from "../effects/effect";
import { TrapSpell, RootTrapSpell, PoisonTrapSpell } from "../effects/spells";
import {
  TankDesc,
  TirelessDesc,
  MonkDesc,
  SnakeDesc,
  CowardDesc,
  WarriorDesc,
  SneakyDesc,
  HunterDesc,
  RogueDesc,
} from "./skill-desc";
import { MessageResponse, MessageResponseStatus } from "../utils/types";
import { Buff2 } from "../entitybase/buff";
import { Conditions } from "../../content/conditions/conditions";

export enum SkillNames {
  Rogue = "rogue",
  Sneaky = "sneaky",
  Coward = "coward",
  Alchemist = "alchemist",
  Hunter = "hunter",
}

export class HeroSkills {
  constructor(private hero: Hero) {}
  AllSkills = [
    { name: "tireless", description: TirelessDesc, level: 0, maxLevel: 3 },
    { name: "tank", description: TankDesc, level: 0, maxLevel: 3 },
    {
      name: "alchemist",
      description:
        "Health effect are more powerfull and potions are more efficient on you. More specialization in this path will increase the duration",
      level: 0,
      maxLevel: 3,
    },
    { name: "monk", description: MonkDesc, level: 0, maxLevel: 5 },
    {
      name: "explorer",
      description: "You find items more often in the dongeon",
      level: 0,
      maxLevel: 3,
    },
    {
      name: "overseer",
      description: "Better scope (+1 range)",
      level: 0,
      maxLevel: 1,
    },
    { name: "snake", description: SnakeDesc, level: 0, maxLevel: 3 },
    {
      name: "coward",
      usable: true,
      description: CowardDesc,
      level: 0,
      maxLevel: 3,
    },
    { name: "warrior", description: WarriorDesc, level: 0, maxLevel: 3 },
    {
      name: "sneaky",
      usable: true,
      description: SneakyDesc,
      level: 0,
      maxLevel: 3,
    },
    {
      name: "hunter",
      usable: true,
      description: HunterDesc,
      level: 0,
      maxLevel: 3,
    },
    {
      name: "rogue",
      usable: true,
      description: RogueDesc,
      level: 0,
      maxLevel: 3,
    },
  ];

  Cooldowns = {
    [SkillNames.Coward]: [0, 100, 75, 50],
    [SkillNames.Sneaky]: [0, 400, 300, 200],
    [SkillNames.Rogue]: [0, 300, 150, 100],
    [SkillNames.Hunter]: [0, 200, 100, 75],
    [SkillNames.Alchemist]: [0, Infinity],
  };

  heroCooldowns = {
    [SkillNames.Coward]: -1,
    [SkillNames.Sneaky]: -1,
    [SkillNames.Rogue]: -1,
    [SkillNames.Hunter]: -1,
    [SkillNames.Alchemist]: Infinity,
  };

  usableSkills() {
    return this.AllSkills.filter((s) => s.level > 0 && s.usable).map((s) => {
      return { ...s, cooldown: this.heroCooldowns[s.name as SkillNames] };
    });
  }

  learnSkill(name: string) {
    const skill = this.AllSkills.find((s) => s.name === name);
    if (!skill) {
      throw new Error(`skill ${name} not found`);
    } else {
      if (skill.level < skill.maxLevel) {
        skill.level += 1;
      } else {
        throw new Error(`skill ${name} is already maxed out`);
      }
    }
    switch (name) {
      case "tireless":
        this.hero.skillFlags.regenHpOverTime++;
        this.hero.health.regenerationRate =
          9 - this.hero.skillFlags.regenHpOverTime;
        break;
      case "tank":
        this.hero.skillFlags.gainHpPerLevel++;
        this.hero.health.getStronger(this.hero.skillFlags.gainHpPerLevel);
        break;
      case "alchemist":
        return this.hero.skillFlags.improvedPotionEffect++;
      case "monk":
        return (this.hero.fightModifier.fistAdditionnalDmg += 2);
      case "explorer":
        return this.hero.skillFlags.additionnalItemPerLevel++;
      case "overseer":
        return this.hero.sight++;
      case "snake":
        return (this.hero.dodge += 0.05);
      case "warrior":
        return (this.hero.fightModifier.additionnalDmg += 1);
      case "coward":
        this.heroCooldowns[SkillNames.Coward] = 0;
        break;
      case "sneaky":
        this.heroCooldowns[SkillNames.Sneaky] = 0;
        break;
      case "rogue":
        this.heroCooldowns[SkillNames.Rogue] = 0;
      case "hunter":
        this.heroCooldowns[SkillNames.Hunter] = 0;
        break;
    }
  }
  update() {
    Object.keys(this.heroCooldowns).forEach((k) => {
      let cd = this.heroCooldowns[k as SkillNames];
      if (cd > 0) this.heroCooldowns[k as SkillNames] -= 1;
    });
  }
  getSkill(name: SkillNames) {
    return this.AllSkills.find((s) => s.name === name);
  }
  getSkillLevel(name: SkillNames) {
    return this.AllSkills.find((s) => s.name === name)?.level || 0;
  }
  // TODO trick
  canCastSkill(name: SkillNames): MessageResponse {
    const skill = this.getSkill(name);
    if (!skill) {
      return {
        timeSpent: 0,
        status: MessageResponseStatus.NotAllowed,
      };
    }
    if (skill.level === 0) {
      return {
        timeSpent: 0,
        status: MessageResponseStatus.NotAllowed,
      };
    }
    if (this.heroCooldowns[name] > 0) {
      return {
        timeSpent: 0,
        status: MessageResponseStatus.NotAllowed,
      };
    }
    return {
      timeSpent: 1,
      status: MessageResponseStatus.Ok,
    };
  }
  castSkill(name: SkillNames) {
    const skill = this.getSkill(name);
    this.heroCooldowns[name] = this.Cooldowns[name][skill.level];
    switch (name) {
      case SkillNames.Sneaky:
        const trapSpell = EffectMaker.createSpell(
          SpellNames.SpikeTrap
        ) as TrapSpell;
        trapSpell.cast(this.hero.pos);
        break;
      case SkillNames.Coward:
        this.hero.addBuff(Buff2.create(Conditions.speed).setTurns(15));
        break;
      case SkillNames.Rogue:
        const rogueSpell: PoisonTrapSpell = EffectMaker.createSpell(
          SpellNames.PoisonTrap
        ) as PoisonTrapSpell;
        rogueSpell.cast();
        break;
      case SkillNames.Hunter:
        const root: RootTrapSpell = EffectMaker.createSpell(
          SpellNames.RootTrap
        ) as RootTrapSpell;
        root.cast();
        break;
      default:
        throw new Error("skill not implemented");
    }
  }
}

export default HeroSkills;
