import { Item } from "../entitybase/item";
import { Hero } from "../hero/hero";
import { gameBus, itemDropped } from "../../eventBus/game-bus";
import { Coordinate, equalsCoordinate } from "../utils/coordinate";
import { ItemCollection } from "../items/item-collection";
import { Place } from "./place-interface";
import { PlaceKind } from "./place-definitions";
import { BloodFountain, HolyFountain, PoisonPot } from "./places";


export class SpecialPlaces {
    places: Place[] = [];
    constructor(private items: ItemCollection) {}
    checkForItem(item: Item) {
        this.places.forEach(p => {
            const pos = item.pos ? item.pos : {x:- 1, y:-1};
            if (equalsCoordinate(p.pos, pos)) {
                const r = p.checkForItem(item);
                if (r != null) {
                    this.items.itemsArray().push(r);
                    gameBus.publish(itemDropped({item: r}));
                }
            }
        });
    }
    checkForHero(hero: Hero) {
        this.places.forEach(p => {
            if (equalsCoordinate(p.pos, hero.pos)) {
                p.checkForHero(hero);
            }
        });
    }
    addPlace(arg: {pos: Coordinate, kind: PlaceKind}) {
        switch(arg.kind) {
            case 'BloodFountain':
                return this.places.push(new BloodFountain(arg.pos));
            case 'HolyFountain':
                return this.places.push(new HolyFountain(arg.pos));
            case 'PoisonPot': 
                return this.places.push(new PoisonPot(arg.pos));
            default: throw new Error('not implemented' + arg.kind);
        }
    }
    getAt(pos: Coordinate) {
        return this.places.find(place => equalsCoordinate(place.pos, pos));
    }
    clear() {
        this.places = [];
    }
}

