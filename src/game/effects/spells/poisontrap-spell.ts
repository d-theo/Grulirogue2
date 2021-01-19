import { gameBus } from "../../../eventBus/game-bus";
import { effectSet, logPublished } from "../../../events";
import { MapEffect } from "../../../map/map-effect";
import { Magic } from "../../entitybase/magic";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class PoisonTrapSpell extends AbstractSpellShell {
    type = EffectTarget.Location;

    cast() {
        const pos = this.world.getHero().pos;
        const poison = {
            magic: new Magic({poison: true}),
            turns: 5
        }
        const id = this.world.getTilemap().addTileEffects({
            debuff: () => poison,
            pos,
            duration: 1,
            stayOnWalk: false,
            debugId: "PoisonTrapSpell",
        });
        gameBus.publish(effectSet({
            animation: 'static',
            id: id,
            type: MapEffect.PoisonTrap,
            pos
        }));
        
        gameBus.publish(logPublished({data: `trap has been set`}));
    }
}