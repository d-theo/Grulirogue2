import { Magic } from "../../entitybase/magic"
import { Hit } from "../../fight/fight";

export const onBeHitAbsorb = new Magic({
    onBeHit: (hit: Hit) => {
        // TODO
    },
    name: 'of courage',
    description: 'Being hit makes your more resistant'
});
export const onBeHitHeal = new Magic({
    onBeHit: (hit: Hit) => {
        // TODO
    },
    name: 'of resilience',
    description: 'You have a small chance to heal yourself we badly wounded'});


export const onBeHitReflect = new Magic({
    name: 'of courage',
    description: 'Being hit makes your more resistant',
    onBeHit: (hit: Hit) => {
         // TODO
    },
});