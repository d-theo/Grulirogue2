import * as _ from 'lodash';
import { Uniqs } from '../../content/loot/loot-uniq';

export type PlaceKind = 'BloodFountain' | 'HolyFountain' | 'PoisonPot' | 'CatAltar';
export const PlaceTypes: PlaceKind[] = ['BloodFountain', 'HolyFountain', 'PoisonPot', 'CatAltar'];
export const PlaceTypesDependency = [
  { place: 'BloodFountain', need: 'UnholyTome' },
  { place: 'HolyFountain', need: null },
  { place: 'PoisonPot', need: null },
  { place: 'CatAltar', need: 'CatStatue' },
];

export function availablePlaceType(): PlaceKind | null {
  const places = PlaceTypesDependency.filter((p) => {
    if (p.need == null) return true;
    return Uniqs.find((u) => u.name === p.need) === undefined;
  });
  const place = _.sample(places);
  if (place) {
    return place.place as PlaceKind;
  } else {
    return null;
  }
}
