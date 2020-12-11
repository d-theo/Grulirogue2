import { RogueEventLevelSingleton } from "../use-cases/map-rogue/rogue";

export class rogueEventHandler {
    handle() {
        RogueEventLevelSingleton.isRogueEventActive = true;  
    }
}
