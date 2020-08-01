import { Action } from "./action";

export class LearnSkillAction extends Action {
    constructor(private args: {name: string}) {
        super();
    }
    execute() {
        this.game.hero.heroSkills.learnSkill(name);
    }
}