import { Weapon } from "./weapon";

export interface Fighter {
    weapon: Weapon;
    level: number;
    dodge: number;
}