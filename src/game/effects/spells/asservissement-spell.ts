import { gameBus } from "../../../eventBus/game-bus";
import { logPublished } from "../../../events";
import { Hero } from "../../hero/hero";
import { Monster } from "../../monsters/monster";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class AsservissementSpell extends AbstractSpellShell {
    type = EffectTarget.Movable;
    cast(target: Hero | Monster) {
        if (target instanceof Hero) {
            gameBus.publish(logPublished({data: `You cannot do that`}));
            return;
        }

        target.setAligment('good');
    }
}