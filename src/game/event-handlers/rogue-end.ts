import { RogueEventLevelSingleton } from "../use-cases/map-rogue/rogue";
import { EventHandler } from "./event-handler";

export class EndRogueEventHandler extends EventHandler {
    
    handle(event) {
        RogueEventLevelSingleton.eventHappened = true; 
        RogueEventLevelSingleton.isRogueEventActive = false;  
    }
}
