import { Hero } from "../../hero/hero";
import { Monster } from "../../monsters/monster";
import { GameRange } from "../../utils/range";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class TeleportationSpell extends AbstractSpellShell  {
    type = EffectTarget.Movable;

    cast(target: Hero|Monster) {
        let done = false;
        const rX = new GameRange(0, this.world.getMapWidth());
        const rY = new GameRange(0, this.world.getMapHeight());
        while(!done) {
            const pos = {
                x: rX.pick(),
                y: rY.pick()
            };
            if (this.world.tileIsEmpty(pos) && this.world.monsterAt(pos) == null) {
                done = true;
                target.pos = pos;
            }
        }
    }
}
