import { gameBus, monsterAttacked, logPublished } from "../../eventBus/game-bus";

export class Log {
    static initialized = false;
    static init() {
        if (Log.initialized) {
            return;
        }
        Log.initialized = true;

        gameBus.subscribe(monsterAttacked, event => {
            Log.log(`The monster is attacking you !`);
        });
    }
    static log(msg: string) {
        gameBus.publish(logPublished({data: msg}));
    }
}