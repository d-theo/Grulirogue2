import { gameBus } from "../../../eventBus/game-bus";
import { effectSet } from "../../../events";
import { MapEffect } from "../../../map/map-effect";
import { Magic } from "../../entitybase/magic";
import { Coordinate, around } from "../../utils/coordinate";
import { randomProc } from "../../utils/random";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";
import { WILDFIRE } from "../effect";

export class WildFireSpell extends AbstractSpellShell {
    type = EffectTarget.Location;
    area = 1;

    cast(pos: Coordinate) {
        around(pos, 1).forEach(p => {
            const dmg = {
                magic: new Magic({onTurn: (entity) => {
                    if (randomProc(50)) {
                        entity.takeDamage(5, WILDFIRE);
                    }
                }}),
                turns: 1,
            }
            const id = this.world.getTilemap().addTileEffects({
                debuff: () => dmg,
                pos: p,
                duration: 10,
                stayOnWalk: true,
                debugId: "WildFireSpell"
            });
            if (id !== null) {
                gameBus.publish(effectSet({
                    id: id,
                    type: MapEffect.Fire,
                    pos: p,
                    animation: 'static'
                }));
            }
        });
    }
}