import { Magic } from "../../entitybase/magic";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class FearSpell extends AbstractSpellShell {
    type = EffectTarget.None;

    cast() {
        const mobs = this.world.getNearestAttackables();
        mobs.forEach(m => {
            m.addBuff({
                magic: new Magic({feared: true}),
                turns: 10,
            });
        });
    }
}