import { Spell } from "../entitybase/spell";
import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { GameRange } from "../utils/range";
/*
'blind',
    'stun',
    'constitution',
    'precision',
    'force',
    'stupidity',
    'weakness',
    'hole',
    'filling',
    'invisibility',
    'fire',
    'ice',
    'poison',
    'teleportation',
    'swap',
    'summoning',
    'haste',
    'bleed',
    'experience',
    'explosive',
    'weapon_enchant',
    'armour_enchant'
*/
export class Stun extends Spell {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => t.enchants.stuned = true,
            end: (t: Hero|Monster) => t.enchants.stuned = false,
            turns: 3
        });
    }
}

export class Bleed extends Spell {
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => {
                t.enchants.bleeding = true
                t.health.take(new GameRange(3,6).pick())
            },
            end: (t: Hero|Monster) => t.enchants.bleeding = false,
            turns: 5
        });
    }
}