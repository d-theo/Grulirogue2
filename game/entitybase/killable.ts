import { Health } from "./health";
import { Armour } from "./armour";
import { BuffEffect } from "./effect";

export interface Killable {
    health: Health;
    armour: Armour;
}