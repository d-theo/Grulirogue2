import { gameBus, logPublished, playerTookDammage, itemPickedUp, playerHealed, itemEquiped, monsterTookDamage } from "../../eventBus/game-bus";

export class Log {
    static initialized = false;
    static init() {
        if (Log.initialized) {
            return;
        }
        Log.initialized = true;

        gameBus.subscribe(playerTookDammage, event => {
            if (event.payload.monster) {
                Log.log(`${event.payload.monster.name} deals you ${Math.abs(event.payload.amount)} dammage`, 'warning');
            } else {
                Log.log(`You suffer from ${event.payload.source}`, 'warning');
            }
        });
        gameBus.subscribe(monsterTookDamage, event => {
            if (event.payload.amount < 0 && event.payload.currentHp !== event.payload.baseHp) { // heal
                Log.log(`${event.payload.monster.name} feels better`);
            } else {
                if (event.payload.externalSource) {
                    Log.log(`${event.payload.externalSource.name} deals ${Math.abs(event.payload.amount)} dammage to ${event.payload.monster.name}`);
                } else {
                    Log.log(`You deal ${Math.abs(event.payload.amount)} dammage to ${event.payload.monster.name}`);
                }
            }
        });
        gameBus.subscribe(itemPickedUp, event => {
			Log.log(`You picked up a ${event.payload.item.name} on the ground`);
        });
        gameBus.subscribe(playerHealed, event => {
            if (event.payload.isSilent) return;
            Log.log(`You feel better`, 'success');
        });
    }
    static log(msg: string, level?: 'danger'|'warning'|'success'|'neutral') {
        gameBus.publish(logPublished({level: level, data: msg}));
    }
}