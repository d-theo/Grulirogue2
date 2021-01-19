import { Magic } from "../entitybase/magic";

export type BuffDefinition = {
    magic: Magic,
    end?;
    turns: number,
    source?: string|null;
};

export const weakState = new Magic({dam: -5})
export const slowState = new Magic({speed: -0.5})
export const ticknessState = new Magic({ac: +3});

export const SICKNESS = 'sickness';
export const POISON = 'poison';
export const BLEEDING = 'bleeding';
export const SHOCK = 'shock';
export const WILDFIRE = 'wild fire';
export const AGING = 'aging';
export const SACRIFICE = 'sacrifice';
export const FRACTURE_SPELL = 'time fracture'
export const BURNING = 'burning';

export const BURN_DAMAGES = 1;
export const POISON_DAMAGES = 3;
export const BLEED_DAMAGES = 5;