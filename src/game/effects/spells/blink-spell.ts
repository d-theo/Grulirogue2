import { gameBus } from "../../../eventBus/game-bus";
import { playerMoved } from "../../../events";
import { Coordinate } from "../../utils/coordinate";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class BlinkSpell extends AbstractSpellShell  {
    type = EffectTarget.Location;

    cast(target: Coordinate) {
        this.world.getHero().pos = target;
        gameBus.publish(playerMoved({}));
    }
}