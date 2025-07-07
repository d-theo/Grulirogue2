import { createEventDefinition } from "ts-bus";
import { MapEffects } from "../../world/map/map-effect";

export const effectSet = createEventDefinition<MapEffects>()("effectSet");
