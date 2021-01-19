import { gameBus } from "../../../eventBus/game-bus";
import { effectSet, logPublished } from "../../../events";
import { MapEffect } from "../../../map/map-effect";
import { Magic } from "../../entitybase/magic";
import { Coordinate } from "../../utils/coordinate";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class TrapSpell extends AbstractSpellShell {
    type = EffectTarget.Location;
    
    cast(pos: Coordinate) {
        const bleed = {
            turns: 3,
            magic: new Magic({bleed: true})
        }
        const id = this.world.getTilemap().addTileEffects({
            debuff: () => bleed,
            pos,
            duration: 1,
            stayOnWalk: false,
            debugId: "TrapSpell",
        });
        if (id !== null) {
            gameBus.publish(effectSet({
                animation: 'static',
                id: id,
                type: MapEffect.Spike,
                pos
            }));
        }
        gameBus.publish(logPublished({data: `trap has been set`}));
    }
}