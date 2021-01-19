import { gameBus } from "../../../eventBus/game-bus";
import { logPublished, itemEquiped } from "../../../events";
import { Weapon } from "../../items/weapon";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class ImproveWeaponSpell extends AbstractSpellShell  {
    type = EffectTarget.Weapon;

    cast(target: Weapon) {
        target.modifyAdditionnalDmg(+1);
        gameBus.publish(logPublished({data: `Your ${target.name} glows magically for a moment.`}));
        gameBus.publish(itemEquiped({weapon: this.world.getHero().weapon}))
    }
}