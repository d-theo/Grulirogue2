import { Hero } from "./hero";
import { EffectMaker, SpellNames, Effects } from "../effects/effect";
import { SpeedEffect, RogueSpell, TrapSpell } from "../effects/effects";
import { TankDesc, TirelessDesc, MonkDesc, SnakeDesc, CowardDesc, WarriorDesc, SneakyDesc } from "./skill-desc";

export enum SkillNames {
    Rogue = 'rogue',
    Sneaky = 'sneaky',
    Coward = 'coward',
}

export class HeroSkills {
    constructor(private hero: Hero) {}
    AllSkills = [
        {name: 'tireless', description: TirelessDesc, level: 0, maxLevel: 3},
        {name: 'tank', description: TankDesc, level: 0, maxLevel: 3},
        {name: 'alchemist', description: 'Some potions are more efficient on you. More specialization in this path will increase the effects', level: 0, maxLevel: 3},
        {name: 'monk', description: MonkDesc, level: 0, maxLevel: 5},
        {name: 'explorer', description: 'You find items more often in the dongeon', level: 0, maxLevel: 3},
        {name: 'overseer', description: 'Better scope (+1 range)', level: 0, maxLevel: 1},
        {name: 'snake', description: SnakeDesc, level: 0, maxLevel: 3},
        {name: 'coward', usable: true, description: CowardDesc, level: 0, maxLevel: 3},
        {name: 'warrior', description: WarriorDesc, level: 0, maxLevel: 3},
        {name: 'sneaky', usable: true, description: SneakyDesc, level: 0, maxLevel: 3},
        {name: 'rogue', usable: true, description: 'you gain a new ability that allow to put poison on you weapon', level: 0, maxLevel: 1},
    ];

    Cooldowns = {
        [SkillNames.Coward]: [100, 75, 50],
        [SkillNames.Sneaky]: [100, 75, 50],
        [SkillNames.Rogue]: [100, 75, 50],
    };

    heroCooldowns = {
        [SkillNames.Coward]: -1,
        [SkillNames.Sneaky]: -1,
        [SkillNames.Rogue]: -1,
    };

    usableSkills() {
        return this.AllSkills
            .filter(s => s.level > 0 && s.usable)
            .map(s => {
                return {... s, cooldown: this.heroCooldowns[s.name as SkillNames] } 
            });
    }

    learnSkill(name: string) {
        const skill = this.AllSkills.find(s => s.name === name);
        if (! skill) {
            throw new Error(`skill ${name} not found`);
        } else {
            if (skill.level < skill.maxLevel) {
                skill.level += 1;
            } else {
                throw new Error(`skill ${name} is already maxed out`);
            }
        }

        switch(name) {
            case 'tireless': 
                this.hero.skillFlags.regenHpOverTime ++;
                this.hero.health.regenerationRate = 9 - this.hero.skillFlags.regenHpOverTime;
                break;
            case 'tank': 
                this.hero.skillFlags.gainHpPerLevel ++;
                this.hero.health.getStronger(this.hero.skillFlags.gainHpPerLevel);
                break;
            case 'alchemist': return this.hero.skillFlags.improvedPotionEffect ++;
            case 'monk': return this.hero.fightModifier.fistAdditionnalDmg += 3;
            case 'explorer': return this.hero.skillFlags.additionnalItemPerLevel ++;
            case 'overseer': return this.hero.sight++;
            case 'snake': return this.hero.dodge += 0.05;
            case 'warrior': return this.hero.fightModifier.additionnalDmg += 1;
            case 'coward': 
                this.heroCooldowns[SkillNames.Coward] = 0;
                break;
            case 'sneaky': 
                this.heroCooldowns[SkillNames.Sneaky] = 0;
                break;
            case 'rogue': 
                this.heroCooldowns[SkillNames.Rogue] = 0;
                break;
        }
    }
    update() {
        Object.keys(this.heroCooldowns).forEach(k => this.heroCooldowns[k as SkillNames] -=  1);
    }
    getSkill(name: SkillNames) {
        return this.AllSkills.find(s => s.name === name);
    }
    castSkill(name: SkillNames) {
        const skill = this.getSkill(name);
        if (!skill) {
            throw new Error(`${name} does not exists`);
        }
        if (skill.level === 0) {
            throw new Error(`${name} not learnt`);
        }
        if (this.heroCooldowns[name] <= 0) {
            this.heroCooldowns[name] = this.Cooldowns[name][skill.level];
            switch (name) {
                case SkillNames.Sneaky: 
                    const trapSpell = EffectMaker.createSpell(SpellNames.SpikeTrap) as TrapSpell;
                    trapSpell.cast(this.hero.pos);
                    break;
                case SkillNames.Coward: 
                    const runEffect: SpeedEffect = EffectMaker.create(Effects.Speed) as SpeedEffect;
                    runEffect.cast(this.hero);
                    break;
                case SkillNames.Rogue:
                    const rogueSpell: RogueSpell = EffectMaker.createSpell(SpellNames.Rogue) as RogueSpell;
                    rogueSpell.cast();
                    break;
                default:
                    throw new Error('skill not implemented');
            }
        }
    }
}

export default HeroSkills;