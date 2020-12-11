import { RogueEventLevelSingleton } from "../use-cases/map-rogue/rogue";
import { EventHandler } from "./event-handler";

export class rogueEventHandler extends EventHandler {
    handle(event) {
        RogueEventLevelSingleton.isRogueEventActive = true;  
    }
}
