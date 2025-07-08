import {greeceTilerConfig} from "./tiler-configs/greece";
import {generateOlMap} from "../../world/generation/map-generators/map_generation_ol";
import {generateRLMap} from "../../world/generation/map-generators/map_generation_rogue";
import {pirateTilerConfig} from "./tiler-configs/pirate";
import {generatePirateMap} from "../../world/generation/map-generators/map_generation_pirate1";
import {generatePirateMap2} from "../../world/generation/map-generators/map_generation_pirate2";
import {rogueTilerConfig} from "./tiler-configs/rogue";
import {RogueEventLevel} from "../../game/generation/event-rogue";
import {LevelDefinition} from "../../world/map/map-generator";

export const LevelDefinitions: Record<number, LevelDefinition> = {
  1: {
    mapGeneratorFn: generateRLMap,
    tilerConfig: greeceTilerConfig,
  },
  2: {
    mapGeneratorFn: generateOlMap,
    tilerConfig: greeceTilerConfig,
  },
  3: {
    mapGeneratorFn: generateRLMap,
    tilerConfig: greeceTilerConfig,
  },
  4: {
    mapGeneratorFn: generatePirateMap,
    tilerConfig: pirateTilerConfig,
  },
  5: {
    mapGeneratorFn: generatePirateMap2,
    tilerConfig: pirateTilerConfig,
  },
  6: {
    mapGeneratorFn: generatePirateMap,
    tilerConfig: pirateTilerConfig,
  },
  [RogueEventLevel]: {
    mapGeneratorFn: generateOlMap,
    tilerConfig: rogueTilerConfig,
  },
};