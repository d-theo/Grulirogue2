import { ZapName } from "./allzaps";
import { EffectMaker, SpellNames } from "../../effects/effect";
import { TeleportationSpell } from "../../effects/spells";
import { Zap } from "./zap";

export class DashZap extends Zap {
    level = 1;
    name = ZapName.DimensionalJump;
    description = 'Accelerate time to dash foward';
    energyNeeded = 10;
    effect = EffectMaker.createSpell(SpellNames.Dash);
}