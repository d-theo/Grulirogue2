import { SpellBook } from "../../effects/spell-book";
import { ZapName } from "./allzaps";
import { Zap } from "./zap";

export class FlashbackZap extends Zap {
    level = 4;
    name = ZapName.Flashback;
    description = 'Return 10 turns behind';
    energyNeeded = 5;
    effect = SpellBook.FlashbackSpell();
}