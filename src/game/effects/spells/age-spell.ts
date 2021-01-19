import { Hero } from "../../hero/hero";
import { Monster } from "../../monsters/monster";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { AGING } from "../effect";
import { EffectTarget } from "../definitions";

export class AgeSpell extends AbstractSpellShell  {
    type = EffectTarget.Movable;
    cast(t: Hero|Monster) {
        const halfCurr = t.hp / 2;
        t.takeDamage(halfCurr, AGING)
    }
}