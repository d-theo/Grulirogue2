import { ZapName } from "./allzaps";
import { IEffect, EffectTarget } from "../../effects/spells";

export abstract class Zap {
    abstract level: number;
    abstract name: ZapName;
    abstract description: string;
    abstract effect: IEffect;
    abstract energyNeeded: number;
    cast(target) {
        this.effect.cast(target);
    }
    targetType(): EffectTarget {
        return this.effect.type;
    }
}