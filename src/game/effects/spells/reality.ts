import { gameBus } from "../../../eventBus/game-bus";
import { endRogueEvent, logPublished } from "../../../events";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class RealityEventSpell extends AbstractSpellShell {
    type = EffectTarget.None;
    cast() {
        gameBus.publish(endRogueEvent({}));
        gameBus.publish(logPublished({level: 'success', data:'Yeah, back to the quest !'}));
    }
}
