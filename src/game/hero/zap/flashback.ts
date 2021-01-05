import { ZapName } from "./allzaps";
import { EffectMaker, SpellNames } from "../../effects/effect";
import { TeleportationSpell } from "../../effects/spells";
import { Zap } from "./zap";

export class FlashbackZap extends Zap {
    level = 4;
    name = ZapName.Flashback;
    description = 'Return 10 turns behind';
    energyNeeded = 5;
    effect = EffectMaker.createSpell(SpellNames.FlashBack);
}