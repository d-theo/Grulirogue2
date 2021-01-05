import { ZapName } from "./allzaps";
import { EffectMaker, SpellNames } from "../../effects/effect";
import { TeleportationSpell } from "../../effects/spells";
import { Zap } from "./zap";

export class SlowZap extends Zap {
    level = 2;
    name = ZapName.TimeSlow;
    description = 'Slow an ennemy';
    energyNeeded = 0;
    effect = EffectMaker.createSpell(SpellNames.Teleportation) as TeleportationSpell;
}