import { Coordinate } from '../../utils/coordinate';
import { Item } from '../entitybase/item';
import { Hero } from '../hero/hero';

export interface Place {
  pos: Coordinate;
  checkForItem(item: Item): any;
  checkForHero(hero: Hero): any;
}
