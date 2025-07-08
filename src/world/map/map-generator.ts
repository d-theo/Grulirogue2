import {MapGraph} from '../generation/map_definition';
import {tilemapper, TilerConfig} from "../generation/tiler";
import {LevelDefinitions} from "../../content/levels/levels";

export type LevelDefinition = {
  mapGeneratorFn: () => any;
  tilerConfig: TilerConfig;
}

export function createMap(level: number, configOverride?: Partial<TilerConfig>): any {
  const {tilerConfig, mapGeneratorFn} = LevelDefinitions[level];
  // merge the tilerConfig with the configOverride
  const map = mapGeneratorFn();
  const {tilemapBG, tilemapFG, mapObject, thingsToPlace} = tilemapper(tilerConfig)(map);
  return {
    tilemap: tilemapBG,
    tilemap2: tilemapFG,
    thingsToPlace: thingsToPlace,
    mapObject: mapObject as any as MapGraph,
  }
}