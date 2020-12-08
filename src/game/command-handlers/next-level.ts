import { createEventDefinition } from "ts-bus";
import { CommandHandler } from "./commands";
import { Game } from "../game";

export const nextLevel = createEventDefinition<{}>()('nextLevel');

export class NextLevelHandler extends CommandHandler {
    constructor() {
        super();
    }
    handle(event) {
        Game.Engine.nextLevelIfAllowed();
    }
}