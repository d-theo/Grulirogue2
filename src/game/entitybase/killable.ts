import { Health } from "./health";
import { Armour } from "./armour";

export interface Killable {
    health: Health;
    armour: Armour;
    dodge: number;
}