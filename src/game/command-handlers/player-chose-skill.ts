import { Hero } from "../hero/hero";
import { playerChoseSkill } from "../../commands";
import { CommandHandler } from "./commands";

export class PlayerChoseSkillhandler extends CommandHandler {
    constructor(private hero: Hero) {
        super();
    }
    handle(event: ReturnType<typeof playerChoseSkill>) {
        const {skills} = event.payload;
        console.log(event.payload)
        this.hero.skills.setActiveSkills(skills);
    }
}