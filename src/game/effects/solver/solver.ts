import { Entity } from "../../entitybase/entity";
import { BLEEDING, BLEED_DAMAGES, BURNING, BURN_DAMAGES, POISON, POISON_DAMAGES } from "../effect";

export const effectSolver = (entity: Entity): void => {
    if (entity.isWet && entity.isBurning) {
        entity.stopBurning();
    }
    if (entity.isWet && entity.isInBushes) {
        entity.heal(1, 'You feel good');
    }
    if (entity.isBurning) {
        entity.takeDamage(BURN_DAMAGES, BURNING);
    }
    if (entity.isBleeding) {
        entity.takeDamage(BLEED_DAMAGES, BLEEDING);
    }
    if (entity.isPoisonned) {
        entity.takeDamage(POISON_DAMAGES, POISON);
    }
}