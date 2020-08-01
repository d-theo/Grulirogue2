import { Game } from "../game";
import assert from "assert";

export abstract class Action {
    protected static _game: Game;
    protected readonly game: Game;
    abstract execute();
    constructor() {
        this.game = Action._game
    }
    static bindOnce(game: Game) {
        assert(game != null, 'game can be bound only once');
        Action._game = game;
    }
}