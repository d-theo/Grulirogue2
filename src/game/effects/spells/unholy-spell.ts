import { gameBus } from "../../../eventBus/game-bus";
import { logPublished } from "../../../events";
import { BloodFountain } from "../../places/places";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";
import { SICKNESS } from "../effect";

export class UnholySpellBook extends AbstractSpellShell {
    type = EffectTarget.None;
    turns = 1;

    cast() {
        const hpos = this.world.getHero().pos;
        const place = this.world.getPlaces().getAt(hpos);

        if (place != null && place instanceof BloodFountain) {
            gameBus.publish(logPublished({level: 'warning', data: `The blood inside the fountain is bubbling !!`}));
            place.cursed = false;
        } else {
            this.world.getHero().takeDamage(1, SICKNESS);
            gameBus.publish(logPublished({level: 'warning', data: `Reading this book is making you nauseous`}));
        }
    }
}