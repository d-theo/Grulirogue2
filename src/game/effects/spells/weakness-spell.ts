import { Hero } from "../../hero/hero";
import { Monster } from "../../monsters/monster";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";
import { weakState } from "../effect";

export class WeaknessSpell extends AbstractSpellShell  {
    type = EffectTarget.Movable;

    cast(t: Hero|Monster) {
        t.addBuff({
            magic: weakState,
            turns: 10
        });
    }
}