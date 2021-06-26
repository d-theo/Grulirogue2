import { slowState, weakState } from "../../effects/effect";
import { Magic } from "../../entitybase/magic"
import { Hit } from "../../fight/fight";
import { randomProc } from "../../utils/random";

export const onHitStun = new Magic({
    name: 'stun',
    description: 'have a small chance to stun the target',
    onHit: (hit: Hit) => {
        if (randomProc(10)) {
            hit.target.addBuff({
                turns: 1,
                magic: new Magic({stun: true})
            });
        }
    }
});
export const onHitBleed = new Magic({
    name: 'bleed',
    description: 'have a small chance to make your target bleed',
    onHit: (hit: Hit) => {
        if (randomProc(7)) {
            hit.target.addBuff({
                turns: 3,
                magic: new Magic({bleed: true})
            });
        }
    }
});
export const onHitPoison = new Magic({
    name: 'poison',
    description: 'have a small chance to poison the target',
    onHit: (hit: Hit) => {
        if (randomProc(10)) {
            hit.target.addBuff({
                turns: 5,
                magic: new Magic({poison: true})
            });
        }
    }
});
export const onHitSlow = new Magic({
    name: 'poison',
    description: 'have a chance to slow the target',
    onHit: (hit: Hit) => {
        if (randomProc(10)) {
            hit.target.addBuff({
                turns: 5,
                magic: new Magic({speed: -0.5})
            });
        }
    }
});
export const onHitShock = new Magic({
    name: 'shock',
    description: 'have a chance to stun and damage the target',
    onHit: (hit: Hit) => {
        if (randomProc(10)) {
            hit.target.addBuff({
                turns: 1,
                magic: new Magic({stun: true})
            });
            hit.damage += 5;
        }
    }
});
export const onHitCold = new Magic({
    name: 'cold',
    description: 'have a small chance to slow the target',
    onHit: (hit: Hit) => {
        if (randomProc(10)) {
            hit.target.addBuff({
                turns: 1,
                magic: slowState
            });
        }
    }
});
export const onHitWeak = new Magic({
    name: 'weak',
    description: 'your attacks can weaken the target',
    onHit: (hit: Hit) => {
        if (randomProc(25)) {
            hit.target.addBuff({
                turns: 2,
                magic: weakState
            });
        }
    }
});