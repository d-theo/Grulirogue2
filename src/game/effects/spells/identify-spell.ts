import { gameBus } from "../../../eventBus/game-bus";
import { logPublished } from "../../../events";
import { Item } from "../../entitybase/item";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class IdentifiySpell extends AbstractSpellShell {
    type = EffectTarget.Item;

    cast(item: Item) {
        item.reveal();
        gameBus.publish(logPublished({level: 'success', data: `You identify a ${item.name}`}));
    }
}
