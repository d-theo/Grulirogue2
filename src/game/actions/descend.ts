import { Action } from "./action";

export class DescendAction extends Action {
    execute() {
        if (this.game.tilemap.getAt(this.game.hero.pos).isExit) {
            this.game.level ++;
            this.game.reInitLevel();
        }
    }
}