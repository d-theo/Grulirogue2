import { ItemTable, ArmoursTable, MiscTable, PotionTable, ScrollTable } from "./loot-table";
import { Potions } from "./loot-potions";

const build = {
    custom: false,
    ItemTable: [{chance: 100, type: 'potion'}],
    ArmoursTable: [{chance: 0, type: null}],
    MiscTable: {chance: 0, type: null},
    PotionTable: {chance: 100, type: Potions.Health},
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