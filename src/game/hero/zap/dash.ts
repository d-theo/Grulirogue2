import { ZapName } from "./allzaps";
import { Zap } from "./zap";
import { SpellBook } from "../../effects/spell-book";

export class DashZap extends Zap {
    level = 1;
    name = ZapName.DimensionalJump;
    description = 'Accelerate time to dash foward';
    energyNeeded = 10;
    effect = SpellBook.DashSpell();
}