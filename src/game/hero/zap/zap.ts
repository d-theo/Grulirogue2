import { IEffect, EffectTarget } from "../../effects/definitions";
import { ZapName } from "./allzaps";

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