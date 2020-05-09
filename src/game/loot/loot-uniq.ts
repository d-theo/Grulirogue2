import { createRogueTome } from "./loot-mics";
import * as _ from 'lodash';

let Uniqs = [
    () => createRogueTome(),
]
export function getUniqLoot() {
    if (Math.random() < 0.15) {
        Uniqs = _.shuffle(Uniqs);
        const f = Uniqs.pop();
        if (f) return f();
        else return null;
    }
}