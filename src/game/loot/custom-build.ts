import { ItemTable, ArmoursTable, MiscTable, PotionTable, ScrollTable } from "./loot-table";
import { createWildFireBottle } from "./loot-mics";
import { Potions } from "./loot-potions";

const build = {
    custom: false,
    ItemTable: [{chance: 100, type: 'potion'}], // type a ecrire
    ArmoursTable: [{chance: 0, type: null}],
    MiscTable: {chance: 0, type: null}, // item a loot
    PotionTable: {chance: 100, type: Potions.Berkserk},
    ScrollTable: {chance: 0, type: null},
};

export function UseCustomBuild(lootnb) {
    if (build.custom) {
        lootnb[1] = 100;
        ItemTable.length = 0;
        ArmoursTable.length = 0;
        MiscTable.length = 0;
        PotionTable.length = 0;
        ScrollTable.length = 0;


        ItemTable.push(build.ItemTable);
        ArmoursTable.push(build.ArmoursTable);
        MiscTable.push(build.MiscTable);
        PotionTable.push(build.PotionTable);
        ScrollTable.push(build.ScrollTable);
    }
}