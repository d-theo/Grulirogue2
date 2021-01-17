import { ZapName } from "./allzaps";
import { Zap } from "./zap";
import { SpellBook } from "../../effects/spell-book";

export class TimeFractureZap extends Zap {
    level = 3;
    name = ZapName.TimeFracture;
    description = 'Create a time breach, dealing damages and slow enemies in an area';
    energyNeeded = 10;
    effect = SpellBook.Fracture;
}