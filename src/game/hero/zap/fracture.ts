import { ZapName } from "./allzaps";
import { EffectMaker, SpellNames } from "../../effects/effect";
import { TeleportationSpell } from "../../effects/spells";
import { Zap } from "./zap";

export class TimeFractureZap extends Zap {
    level = 3;
    name = ZapName.TimeFracture;
    description = 'Create a time breach, dealing damages and slow enemies in an area';
    energyNeeded = 1;
    effect = EffectMaker.createSpell(SpellNames.Fracture);
}