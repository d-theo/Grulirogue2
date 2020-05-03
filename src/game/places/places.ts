import { Place } from "./place-interface";
import { Coordinate } from "../utils/coordinate";
import { Item } from "../entitybase/item";
import { Potion } from "../items/potion";
import { gameBus, logPublished, itemRemoved } from "../../eventBus/game-bus";
import { Weapon } from "../items/weapon";
import { Armour } from "../items/armour";
import { Hero } from "../hero/hero";
import { createSmellyBottle } from "../loot/loot-mics";
import { EffectMaker, Effects } from "../effects/effect";
import { Scroll } from "../items/scroll";

export class BloodFountain implements Place {
    cursed = true;
    used = false;
    constructor(public pos: Coordinate){}
    checkForItem(item: Item): any {
        if (item instanceof Scroll) {
            gameBus.publish(logPublished({
                data: `You put your scroll in the fountain... As expected, it's wet and wasted now.`,
                level: 'warning'
            }));
            gameBus.publish(itemRemoved({
                item: item
            }));
        }
        else if (item instanceof Potion) {
            gameBus.publish(logPublished({
                data: 'You empty your potion in the fountain',
                level: 'warning'
            }));
            gameBus.publish(itemRemoved({
                item: item
            }));
        } else if (item instanceof Weapon) {
            if (this.cursed) {
                gameBus.publish(logPublished({
                    data: `${item.name} is cursed !`,
                    level: 'warning'
                }));
                item.additionnalDmg -= 3;
            } else {
                if (!this.used) {
                    gameBus.publish(logPublished({
                        data: `${item.name} is filled with blood of your ennemies !`,
                        level: 'warning'
                    }));
                    const e = EffectMaker.create(Effects.Bleed);
                    item.additionnalEffects.push({
                        chance: 0.2,
                        effect: e,
                        target: 'target'
                    });
                    item.additionalDescription.push('This item is thristy for blood');
                    this.used = true;
                }
            }
        } else if (item instanceof Armour) {
            if (this.cursed) {
                gameBus.publish(logPublished({
                    data: `${item.name} is tainted with blood...`,
                    level: 'warning'
                }));
                item.baseAbsorb -= 2;
            } else {
                if (!this.used) {
                    gameBus.publish(logPublished({
                        data: `${item.name} is bloody terrifying !`,
                        level: 'warning'
                    }));
                    item.baseAbsorb += 2;
                    this.used = true;
                }
            }
        }
        return null;
    }
    checkForHero(hero: Hero): any {
        gameBus.publish(logPublished({
            data: 'You are on a top of a cursed fountain filled with blood...',
            level: 'warning'
        }));
    }
}
export class HolyFountain implements Place {
    used = 5;
    constructor(public pos: Coordinate){ }
    checkForItem(item: Item): any {
        if (item instanceof Scroll) {
            gameBus.publish(logPublished({
                data: `You put your scroll in the fountain... As expected, it's wet and wasted now.`,
                level: 'warning'
            }));
            gameBus.publish(itemRemoved({
                item: item
            }));
        }
        else if (item instanceof Potion) {
            gameBus.publish(logPublished({
                data: `Your empty your potion in the fountain...`,
                level: 'warning'
            }));
            gameBus.publish(itemRemoved({
                item: item
            }));
            this.used ++;
        } else if (this.used <= 2) {
            gameBus.publish(logPublished({
                data: `The fountain looks dry`,
                level: 'warning'
            }));
        } else if (!item.identified) {
            gameBus.publish(logPublished({
                data: `${item.name} reveals its true nature !`,
                level: 'warning'
            }));
            item.reveal();
            this.used -= 2;
        } else if (item instanceof Weapon) {
            item.additionnalDmg += 1;
            gameBus.publish(logPublished({
                data: `${item.name} is blessed`,
                level: 'success'
            }));
            this.used -= 3;
        }
    }
    checkForHero(hero: Hero): any {
        gameBus.publish(logPublished({
            data: 'You are on a top of a crystal clear water fountain',
            level: 'warning'
        }));
    }
}
export class PoisonPot implements Place {
    constructor(public pos: Coordinate){}
    checkForItem(item: Item): any {
        if (item instanceof Potion) {
            gameBus.publish(itemRemoved({
                item: item
            }));
            if (Math.random() > 0.50) {
                gameBus.publish(logPublished({
                    data: 'You empty your potion to fill it with poison',
                    level: 'warning'
                }));

                const poison = createSmellyBottle();
                poison.pos = {x: this.pos.x, y: this.pos.y+1};
                return poison;
            } else {
                gameBus.publish(logPublished({
                    data: 'Your potion melted',
                    level: 'warning'
                }));
            }
        }
        return null;
    }
    checkForHero(hero: Hero): any {
        gameBus.publish(logPublished({
            data: 'You are on a top of a bubbly and smell pot...',
            level: 'warning'
        }));
    }
}