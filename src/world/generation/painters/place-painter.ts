import {ThingToPlace} from '../map_tiling_utils';
import {Terrain} from '../../map/terrain';
import {availablePlaceType} from '../../../game/places/place-definitions';

export function placePainter(room, tilemap1, tilemap2, thingsToPlace: ThingToPlace[]) {
  const pos = {x: Math.floor(room.rect.x + room.rect.width / 2), y: Math.floor(room.rect.y + room.rect.height / 2)};
  let placeType = availablePlaceType();
  if (placeType) {
    tilemap2[pos.y][pos.x] = Terrain[placeType];
    thingsToPlace.push({type: placeType, pos: pos});
  }
}
