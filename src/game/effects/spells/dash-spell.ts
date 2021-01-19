import { gameBus } from "../../../eventBus/game-bus";
import { playerMoved } from "../../../events";
import { line } from "../../tilemap/sight";
import { Coordinate } from "../../utils/coordinate";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class DashSpell extends AbstractSpellShell {
    type = EffectTarget.Location;

    cast(target: Coordinate) {
        const l = line({from: this.world.getHero().pos, to: target});
        const n = Math.min(4, l.length);
        for (let i = 1; i < n; i ++) {
            const pos = l[i];
            if (this.world.monsterAt(pos) != null || !this.world.tileIsEmpty(pos)) {
                this.world.getHero().pos = l[i - i];
                gameBus.publish(playerMoved({}));
                return;
            }
        }
        this.world.getHero().pos = l[n-1];
        gameBus.publish(playerMoved({}));
    }
}