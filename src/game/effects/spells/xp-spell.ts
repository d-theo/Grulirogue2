import { gameBus } from "../../../eventBus/game-bus";
import { heroGainedXp, logPublished } from "../../../events";
import { Hero } from "../../hero/hero";
import { Monster } from "../../monsters/monster";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

/// SHOULD BE SPELLS
export class XPEffect extends AbstractSpellShell {
    type = EffectTarget.Movable;
    cast(target: Hero | Monster) {
        if (target instanceof Hero) {
            gameBus.publish(heroGainedXp({
                amount: 250
            }));
            gameBus.publish(logPublished({level: 'success', data:'you are wiser !'}));
        } else {
            gameBus.publish(logPublished({data:'nothing happens'}));
        }
    }
}