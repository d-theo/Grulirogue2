import { RegenPassiveSkill } from './skills/regen';
import { DamagePassiveSkill } from './skills/damage';
import { HealthPassiveSkill } from './skills/health';
import { DodgePassiveSkill } from './skills/dodge';
import { CastPassiveSkill } from './skills/cast';
import { BatteryPassiveSkill } from './skills/battery';
import { ArmourPassiveSkill } from './skills/armour';
import { Hero } from './hero';
import { PassiveSkill } from './skills/passive-skills';
import { ChargingPassiveSkill } from './skills/charging';
export class SkillManager {
    private skills: PassiveSkill[] = [
        new ArmourPassiveSkill(this.hero),
        new BatteryPassiveSkill(this.hero),
        new CastPassiveSkill(this.hero),
        new DodgePassiveSkill(this.hero),
        new ChargingPassiveSkill(this.hero),
        new HealthPassiveSkill(this.hero),
        new DamagePassiveSkill(this.hero),
        new RegenPassiveSkill(this.hero),
    ];
    private selectedSkills = [];
    constructor(private readonly hero: Hero) {}
    public addXp(xp: number) {
        const n = this.selectedSkills.length;
        this.selectedSkills.forEach(s => s.addXp(xp/n));
    }
    public setActiveSkills(skills: Partial<PassiveSkill & {specialization: number}>[]) {
        this.selectedSkills = [];
        for (let skill of skills) {
            if (skill.specialization == 1) {
                this.selectedSkills.push(this.skills.find(s => s.name === skill.name));
            } else if (skill.specialization === 2) {
                this.selectedSkills.push(this.skills.find(s => s.name === skill.name));
                this.selectedSkills.push(this.skills.find(s => s.name === skill.name));
            }
        }
    }
    public report() {
        return this.skills.map(skill => {
            const spe = this.selectedSkills.filter(s => s.name === skill.name).length;
            return {...skill.report(), specialization: spe};
        });
    }
    public levelOfSkill(className: typeof PassiveSkill) {
        for (const s of this.skills) {
            if (s instanceof className) {
                return s.level;
            }
        }
    }
    public valueOfSkill(className: typeof PassiveSkill) {
        for (const s of this.skills) {
            if (s instanceof className) {
                return s.value;
            }
        }
    }
}