import { RogueEventLevelSingleton } from "../use-cases/map-rogue/rogue";

export class EndRogueEventHandler {
    constructor() {}
    handle() {
        RogueEventLevelSingleton.eventHappened = true; 
        RogueEventLevelSingleton.isRogueEventActive = false;  
    }
}
