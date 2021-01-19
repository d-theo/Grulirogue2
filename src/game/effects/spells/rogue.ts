import { gameBus } from "../../../eventBus/game-bus";
import { rogueEvent, logPublished } from "../../../events";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class RogueEventSpell extends AbstractSpellShell {
    type = EffectTarget.None;
    cast() {
        gameBus.publish(rogueEvent({}));
        gameBus.publish(logPublished({level: 'danger', data:'where the heck are you ?!'}));
    }
}