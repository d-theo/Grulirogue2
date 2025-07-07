import { createRogueTome, createUnholyBook, CatStatue } from "./loot-mics";
import * as _ from 'lodash';

export type UniqsNames = 
|'RogueTome'
|'UnholyTome'
|'CatStatue';

export let Uniqs = [
    {name:'RogueTome' , item: () => createRogueTome()},
    {name:'UnholyTome', item: () => createUnholyBook()},
    {name:'CatStatue', item: () => new CatStatue({})},
]
export function getUniqLoot() {
    if (Math.random() < 0.15) {
        Uniqs = _.shuffle(Uniqs);
        const f = Uniqs.pop();
        if (f) return f.item();
        else return null;
    }
}