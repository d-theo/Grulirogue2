import { Coordinate } from "../../utils/coordinate";

export enum MapEffect {
  Spike = "Spikes",
  Projectile = "rock",
  Fire = "Fire",
  Shadow = "Shadow",
  Root = "Root",
  PoisonTrap = "Poison_Trap",
  Poison = "Poison",
  Cold = "Cold",
  Water = "Water",
  Light = "Light",
  Floral = "Floral",
}

export type StaticEffet = {
  id: string;
  animation: "static";
  pos: Coordinate;
  type: MapEffect;
};
export type ThrowEffet = {
  animation: "throw";
  from: Coordinate;
  to: Coordinate;
  type: MapEffect;
};

export type MapEffects = StaticEffet | ThrowEffet;
