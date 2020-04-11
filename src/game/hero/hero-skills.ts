import { Hero } from "./hero";

export class HeroSkills {
    constructor(private hero: Hero) {}
    AllSkills = [
        {name: 'tireless', description: 'Regenerate hp over time. More level in this skill will regenerate faster', level: 0, maxLevel: 3},
        {name: 'tank', description: 'Gain permanent HP each level. More level in this skill allow to gain more hp/level', level: 0, maxLevel: 3},
        {name: 'alchemist', description: 'Some potions are more efficient. More specialization in this path will increase the bonuses', level: 0, maxLevel: 3},
        {name: 'monk', description: 'you are a beast with your fists. More expertise = more dammage !', level: 0, maxLevel: 5},
        {name: 'explorer', description: 'you find more items', level: 0, maxLevel: 3},
        {name: 'overseer', description: 'you see further', level: 0, maxLevel: 1},
        {name: 'snake', description: 'you avoid hits more often', level: 0, maxLevel: 3},
        {name: 'coward', description: 'you gain a new ability that allow to run. More level in this skill will decrease the cooldown.', level: 0, maxLevel: 3},
        {name: 'warrior', description: 'your attacks are stronger', level: 0, maxLevel: 3},
        {name: 'sneaky', description: 'you gain a new ability that allow to set traps. More level in this skill will increase cooldown and trap dammages.', level: 0, maxLevel: 3},
        {name: 'rogue', description: 'you gain a new ability that allow to put poison on you weapon', level: 0, maxLevel: 1},
    ];

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
                this.hero.health.regenerationRate = 8 - this.hero.skillFlags.regenHpOverTime;
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
            case 'coward': return ;
            case 'sneaky': return ;
            case 'rogue': return ;
        }
    }
}

export default HeroSkills;