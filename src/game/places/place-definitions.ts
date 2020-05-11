import { Uniqs } from "../loot/loot-uniq";
import * as _ from 'lodash';

export type PlaceKind = 'BloodFountain'| 'HolyFountain' | 'PoisonPot' | 'CatAltar';
export const PlaceTypes: PlaceKind[] = ['BloodFountain', 'HolyFountain', 'PoisonPot', 'CatAltar'];
export const PlaceTypesDependency = [
    {place:'BloodFountain', need: 'UnholyTome'},
    {place:'HolyFountain', need: null},
    {place:'PoisonPot', need: null},
    {place:'CatAltar', need: 'CatStatue'}];

export function availablePlaceType () {
    const places = (PlaceTypesDependency.filter(p => {
        if (p.need == null) return true;
        return Uniqs.find(u => u.name === p.need) === undefined;
    }));
    console.log(places);
    const place = _.sample(places);
    if (place) {
        return place.place;
    } else {
        return null;
    }
}