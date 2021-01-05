import { ZapName } from "./allzaps";
import { EffectMaker, SpellNames } from "../../effects/effect";
import { TeleportationSpell } from "../../effects/spells";
import { Zap } from "./zap";

export class AgeZap extends Zap {
    level = 5;
    name = ZapName.Aging;
    description = 'Accelerate time around an ennemy, aging him and causing 50% of current HP damages';
    energyNeeded = 0;
    effect = EffectMaker.createSpell(SpellNames.Teleportation) as TeleportationSpell;
}