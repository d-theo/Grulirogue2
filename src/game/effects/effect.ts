import { Magic } from "../entitybase/magic";

export type BuffDefinition = {
    magic: Magic,
    end?;
    turns: number,
    source?: string|null;
};

export const weakState = new Magic({dam: -5})
export const slowState = new Magic({speed: -0.5})

export const SICKNESS = 'sickness';
export const POISON = 'poison';
export const BLEEDING = 'bleeding';
export const SHOCK = 'shock';
export const WILDFIRE = 'wild fire';
export const AGING = 'aging';
export const SACRIFICE = 'sacrifice';