import { Action } from "./action";

export class RestAction extends Action {
    execute() {
        this.game.nextTurn(1);   
    }
}