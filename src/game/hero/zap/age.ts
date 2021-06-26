import { ZapName } from "./allzaps";
import { Zap } from "./zap";
import { SpellBook } from "../../effects/spell-book";

export class AgeZap extends Zap {
    level = 5;
    name = ZapName.Aging;
    description = 'Accelerate time around an ennemy, aging him and causing 50% of current HP damages';
    energyNeeded = 0;
    effect = SpellBook.AgeSpell();
}