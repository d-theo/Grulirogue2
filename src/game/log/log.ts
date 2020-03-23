import { gameBus, monsterAttacked, logPublished, playerTookDammage } from "../../eventBus/game-bus";

export class Log {
    static initialized = false;
    static init() {
        if (Log.initialized) {
            return;
        }
        Log.initialized = true;

        gameBus.subscribe(playerTookDammage, event => {
            Log.log(`${event.payload.monster.name} deals you ${Math.abs(event.payload.amount)} dammage`);
        });
    }
    static log(msg: string) {
        gameBus.publish(logPublished({data: msg}));
    }
}