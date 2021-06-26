import { Magic } from "../../entitybase/magic"
import { Hit } from "../../fight/fight";
import { pickInRange, randomProc } from "../../utils/random";

export const onBeHitAbsorb = new Magic({
    onBeHit: (hit: Hit) => {
        hit.target.addBuff({
            magic: new Magic({ac: 1}),
            turns: 5,
        });
    },
    name: 'of courage',
    description: 'Being hit makes you more resistant'
});
export const onBeHitHeal = new Magic({
    onBeHit: (hit: Hit) => {
        if (hit.target.basehp / hit.damage > 10 && randomProc(25)) {
            hit.target.heal(pickInRange(5,  hit.damage), 'You feel brave');
        }
    },
    name: 'of resilience',
    description: 'You have a small chance to heal yourself when badly wounded'});


export const onBeHitReflect = new Magic({
    name: 'of courage',
    description: 'You reflect a part of the damage you take',
    onBeHit: (hit: Hit) => {
         hit.attacker.takeDamage(Math.floor(hit.damage/10), '');
    },
});