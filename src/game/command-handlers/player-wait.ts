import { createEventDefinition, EventBus } from "ts-bus";
import { CommandHandler } from "./commands";
import { gameBus } from "../../eventBus/game-bus";
import { timePassed } from "../../events";


export const waitATurn = createEventDefinition<{}>()('waitATurn');

export class PlayerWaitATurnHandler extends CommandHandler{
    handle(event) {
        gameBus.publish(timePassed({timeSpent: 1}));   
    }
}