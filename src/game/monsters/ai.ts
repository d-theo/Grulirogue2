import {Monster} from './monster';
import { GameRange } from '../utils/range';
import { Game } from '../game';
import { monsterMove } from '../use-cases/monsterMove';
import { monsterAttack } from '../use-cases/monsterAttack';
import { astar } from '../tilemap/astar';
import { Coordinate } from '../utils/coordinate';
import { isTileEmpty } from '../use-cases/preconditions/moveAllowed';

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
        const hasVisibility = game.tilemap.hasVisibility({from: monster.pos, to: game.hero.pos});
        const distance = Math.max(dx,dy);
        if (distance > monster.sight + 2) {
            monster.asSeenHero = false;
            monster.currentAI = 'random';
            return randomAI(monster);
        } else if  (hasVisibility) {
            monster.asSeenHero = true;
            monster.currentAI = 'agressive';
            return agressiveAI(monster);
        } else if (monster.asSeenHero) {
            monster.currentAI = 'agressive';
            return agressiveAI(monster);
        } else {
            monster.currentAI = 'random';
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
            const otherMobsPositions = game
                .monsters
                .monstersArray()
                .filter(m => m.id !== monster.id)
                .map(m => m.pos);
            const path = astar({
                from: monster.pos,
                to: game.hero.pos,
                tiles: game.tilemap.tiles,
                additionnalObstacle: otherMobsPositions
            });
            if (path.length > 0) {
                monsterMove({
                    game: game,
                    monster: monster,
                    nextPos: path[0]
                });
            }
        }
    }

    function fearfullAI (monster: Monster) {
        const heroPos = game.hero.pos;        
        const selfPos = monster.pos;

        const dir = relativePosition(selfPos, heroPos);
        const ne = [
            {x:selfPos.x+1, y: selfPos.y-1},
            {x:selfPos.x+1, y: selfPos.y},
            {x:selfPos.x, y: selfPos.y-1},
        ];
        const nw = [
            {x:selfPos.x-1, y: selfPos.y-1},
            {x:selfPos.x-1, y: selfPos.y},
            {x:selfPos.x, y: selfPos.y-1},
        ];
        const n = [
            {x:selfPos.x, y: selfPos.y-1},
            {x:selfPos.x-1, y: selfPos.y-1},
            {x:selfPos.x+1, y: selfPos.y-1},
        ];
        const s = [
            {x:selfPos.x, y: selfPos.y+1},
            {x:selfPos.x-1, y: selfPos.y+1},
            {x:selfPos.x+1, y: selfPos.y+1},
        ];
        const sw = [
            {x:selfPos.x-1, y: selfPos.y+1},
            {x:selfPos.x, y: selfPos.y+1},
            {x:selfPos.x-1, y: selfPos.y},
        ];
        const se = [
            {x:selfPos.x+1, y: selfPos.y+1},
            {x:selfPos.x+1, y: selfPos.y},
            {x:selfPos.x, y: selfPos.y+1},
        ];
        let nextMoves: Coordinate[]|any = {
            NE: ne,
            N:n,
            NW: nw,
            S: s,
            SW: sw,
            SE: se
        };
        const possibleMoves = nextMoves[dir];
        let chosedMove;
        for (const m of possibleMoves) {
            const t = game.tilemap.getAt(m);
            if (t.isWalkable() === true && isTileEmpty(m, game.monsters.monstersArray())) {
                chosedMove = m;
            } 
        }
        if (chosedMove) {
            monsterMove({
                game: game,
                monster: monster,
                nextPos: chosedMove
            });
        }
    }

    function randomAI (monster: Monster) {
        const rand = new GameRange(-1,1);
        const x = rand.pick();
        const y = rand.pick();
        const nextPos = {
            x: monster.pos.x+x,
            y: monster.pos.y+y
        };
        monsterMove({
            game: game,
            monster: monster,
            nextPos
        })
    }

    function friendlyAI(monster: Monster) {
        
    }
}

function relativePosition(pos1: Coordinate, pos2: Coordinate) {
    let str = '';
    if (pos1.y - pos2.y > 0) {
        str+='S'
    }else if (pos1.y - pos2.y < 0) {
        str+='N'
    }
    if (pos1.x - pos2.x > 0) {
        str+='E'
    }else if (pos1.x - pos2.x < 0) {
        str+='W'
    }
    return str;
}