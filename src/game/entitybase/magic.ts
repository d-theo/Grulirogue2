import { Hit } from "../fight/fight";
import { Entity } from "./entity";

export class Magic {
    maxhp: number = 0;
    precision: number = 0;
    dodge: number = 0;
    speed: number = 0;
    sigth: number = 0;
    dam: number = 0;
    ac: number = 0;
    energy: number = 0;
    hpRegen: number = 0;
    energyRegen: number = 0;
    chance: number = 0;

    wet = false;
    inBushes = false;
    burn = false;
    poison = false;
    bleed = false;
    stun = false;
    feared = false;

    onTurn: (me: Entity) => void = () => ({});
    onHit: (hit: Hit) => void = () => ({});
    onBeHit: (hit: Hit) => void = () => ({});

    name: string;
    description: string;
    constructor(arg: Partial<Magic>) {
        Object.assign(this, arg);
    }
}