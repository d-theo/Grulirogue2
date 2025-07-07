import { playerChoseSkill } from "../commands";
import { Hero } from "../game/hero/hero";
import { CommandHandler } from "./commands";

export class PlayerChoseSkillhandler extends CommandHandler {
  constructor(private hero: Hero) {
    super();
  }
  handle(event: ReturnType<typeof playerChoseSkill>) {
    const { name } = event.payload;
    this.hero.heroSkills.learnSkill(name);
  }
}
