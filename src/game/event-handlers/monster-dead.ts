import { EventHandler } from "./event-handler";
import { MonsterCollection } from "../monsters/monsterCollection";
import { monsterDead } from "../../events";

export class MonsterDeadHandler extends EventHandler {
    constructor(private monsters: MonsterCollection) {
        super();
    }
    handle(event: ReturnType<typeof monsterDead>) {
        const {monster} = event.payload;
        this.monsters.removeMonster(monster);
    }
}