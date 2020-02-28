import { Spell } from "../entitybase/spell";
import { Monster } from "../monsters/monster";
import { Hero } from "../hero/hero";
import { GameRange } from "../utils/range";
import { Tile } from "../tilemap/tile";
import { TileType } from "../tilemap/tileType";
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
            turns: 5
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
            turns: 7
        });
    }
}

export class ConstSpell extends Spell{
    type = ['monster','hero']
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => t.health.currentHp += target.level * 7,
            end: (t: Hero|Monster) => t.health.currentHp -= target.level * 7,
            turns: 15
        });
    }
}

export class HoleSpell extends Spell{
    type = ['tile']
    cast(tile: Tile) {
        
    }
}

export class RockSpell extends Spell{
    type = ['tile']
    cast(tile: Tile) {
        tile.type = TileType.WallGrey;   
    }
}

export class InvisibilitySpell extends Spell{
    type = ['monster','hero'];
    cast(target: Hero|Monster) {
        target.addBuff({
            tick: (t: Hero|Monster) => t.enchants.invisibility = true,
            end: (t: Hero|Monster) => t.enchants.invisibility = false,
            turns: 15
        });
    }
}

export class SwapSpell extends Spell{
    type = ['monster','hero'];
    cast(target1: Hero|Monster, target2: Hero|Monster) {
        const pos = target1.pos;
        target1.pos = target2.pos;
        target2.pos = pos;
    }
}

export class TeleportationSpell extends Spell{
    type = ['monster','hero'];
    cast(target: Hero|Monster) {
        let done = false;
        const rX = new GameRange(0, this.getMapWidth());
        const rY = new GameRange(0, this.getMapHeight());
        while(!done) {
            const pos = {
                x: rX.pick(),
                y: rY.pick()
            };
            if (this.tileIsEmpty(pos) && this.monsterAt(pos) == null) {
                done = true;
                target.pos = pos;
            }
        }
    }
}