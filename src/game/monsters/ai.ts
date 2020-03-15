import {Monster} from './monster';
import { GameRange } from '../utils/range';
import { Game } from '../game';
import { monsterMove } from '../use-cases/monsterMove';
import { monsterAttack } from '../use-cases/monsterAttack';
import { astar } from '../tilemap/astar';

export type Behavior = (monster: Monster) => void;

export class AIBehavior {
    static aiMap: Map<string, Behavior>
    static init(m: Map<string, Behavior>) {
        this.aiMap = m;
    }
    static Default(): Behavior {
        const b = this.aiMap.get('default');
        if (!b) throw new Error('no blind IA initialized')
        return b;
    }
    static Agressive(): Behavior {
        const b = this.aiMap.get('agressive');
        if (!b) throw new Error('no agressive IA initialized')
        return b;
    }
    static Blind(): Behavior {
        const b = this.aiMap.get('blind');
        if (!b) throw new Error('no agressive IA initialized')
        return b;
    }
}

export const AI = (game: Game) => {
    const ais = new Map<string, Behavior>();
    ais.set('agressive', agressiveAI);
    ais.set('blind', randomAI);
    ais.set('default', defaultAI);
    return ais;

    function defaultAI(monster: Monster) {
        const dx = Math.abs(monster.pos.x - game.hero.pos.x);
        const dy = Math.abs(monster.pos.y - game.hero.pos.y);

        if (Math.max(dx,dy) < 8) {
            return agressiveAI(monster);
        } else {
            return randomAI(monster);
        }
    }

    function agressiveAI (monster: Monster) {
        const hasVisibility = game.tilemap.hasVisibility({from: monster.pos, to: game.hero.pos});
        const dx = monster.pos.x - game.hero.pos.x;
        const dy = monster.pos.y - game.hero.pos.y;
        const range = Math.max(Math.abs(dx),Math.abs(dy));
        if (monster.weapon.maxRange >= range && hasVisibility) {
            monsterAttack({
                hero: game.hero,
                monster
            });
        } else {
            const R = 8;
            const posAround = game.tilemap.subTitles({
                from: monster.pos,
                range: R,
            });

            console.log(game.hero.pos)
            console.log(monster.pos)
            console.log(dx,dy)

            const path = astar({
                from: {x:R, y:R},
                to: {x:R-dx, y:R-dy},
                tiles: posAround
            });
            const delta = {
                x: monster.pos.x - R,
                y: monster.pos.y - R
            }
            const dpath = path.map(pos => {return {x: pos.x+delta.x, y:pos.y+delta.y}});
            if (path.length > 0) {
                monsterMove({
                    game: game,
                    monster: monster,
                    nextPos: dpath[0]
                });
            }
        }
    }

    function randomAI (monster: Monster) {
        console.log('randomAI');
        const rand = new GameRange(-1,1);
        const x = rand.pick();
        const y = rand.pick();
        const nextPos = {
            x: monster.pos.x+x,
            y: monster.pos.y+y
        };
        console.log('move')
        monsterMove({
            game: game,
            monster: monster,
            nextPos
        })
    }
}

