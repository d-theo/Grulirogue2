import { SpellBook } from "../../effects/spell-book";
import { ZapName } from "./allzaps";
import { Zap } from "./zap";

export class SlowZap extends Zap {
    level = 2;
    name = ZapName.TimeSlow;
    description = 'Slow an ennemy';
    energyNeeded = 10;
    effect = SpellBook.SlowSpell()
}