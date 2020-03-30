import { gameBus, monsterAttacked, logPublished, playerTookDammage, playerAttackedMonster, itemPickedUp, playerHealed } from "../../eventBus/game-bus";

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
        playerAttackedMonster
        gameBus.subscribe(playerAttackedMonster, event => {
            Log.log(`You deal ${Math.abs(event.payload.amount)} dammage to ${event.payload.monster.name}`);
        });
        gameBus.subscribe(itemPickedUp, event => {
			Log.log(`You picked up a ${event.payload.item.name} on the ground`);
        });
        gameBus.subscribe(playerHealed, event => {
            Log.log(`You feel better`);
        });
    }
    static log(msg: string) {
        gameBus.publish(logPublished({data: msg}));
    }
}