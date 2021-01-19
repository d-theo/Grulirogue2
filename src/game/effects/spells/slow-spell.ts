import { Hero } from "../../hero/hero";
import { Monster } from "../../monsters/monster";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";
import { slowState } from "../effect";

export class SlowSpell extends AbstractSpellShell {
    type = EffectTarget.Movable;
    cast(t: Hero|Monster) {
        t.addBuff({
            turns: 5,
            magic: slowState
        });
    }
}