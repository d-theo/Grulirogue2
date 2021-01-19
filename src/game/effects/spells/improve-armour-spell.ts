import { gameBus } from "../../../eventBus/game-bus";
import { logPublished, itemEquiped } from "../../../events";
import { Armour } from "../../items/armour";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class ImproveArmourSpell extends AbstractSpellShell  {
    type = EffectTarget.Armour;

    cast(target: Armour) {
        target.addAbsorbEnchant(1);
        gameBus.publish(logPublished({data: `Your ${target.name} glows magically for a moment.`}));
        gameBus.publish(itemEquiped({armour: this.world.getHero().armour}))
    }
}