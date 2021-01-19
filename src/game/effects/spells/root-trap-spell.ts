import { gameBus } from "../../../eventBus/game-bus";
import { effectSet, logPublished } from "../../../events";
import { MapEffect } from "../../../map/map-effect";
import { Magic } from "../../entitybase/magic";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class RootTrapSpell extends AbstractSpellShell {
    type = EffectTarget.Location;

    cast() {
        const id = this.world.getTilemap().addTileEffects({
            debuff: () => {
                return {
                    magic: new Magic({stun: true}),
                    turns: 3
                }
            },
            pos: this.world.getHero().pos,
            duration: 1,
            stayOnWalk: false,
            debugId: "RootTrapSpell",
        });
        gameBus.publish(effectSet({
            animation: 'static',
            id: id,
            type: MapEffect.Root,
            pos: this.world.getHero().pos
        }));
        
        gameBus.publish(logPublished({data: `trap has been set`}));
    }
}