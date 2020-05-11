import {Monster} from './monster';
import { GameRange } from '../utils/range';
import { Game } from '../game';
import { monsterMove } from '../use-cases/monsterMove';
import { monsterAttack } from '../use-cases/monsterAttack';
import { astar } from '../tilemap/astar';
import { Coordinate, equalsCoordinate } from '../utils/coordinate';
import { isTileEmpty } from '../use-cases/preconditions/moveAllowed';
import { Hero } from '../hero/hero';
import * as _ from 'lodash';

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
    static Fearfull(): Behavior {
        const b = this.aiMap.get('fearfull');
        if (!b) throw new Error('no fearfull IA initialized')
        return b;
    }
    static friendlyAI(): Behavior {
        const b = this.aiMap.get('friendly');
        if (!b) throw new Error('no friendly IA initialized')
        return b;
    }
}

export const AI = (game: Game) => {
    const ais = new Map<string, Behavior>();
    ais.set('agressive', agressiveAI);
    ais.set('blind', randomAI);
    ais.set('default', defaultAI);
    ais.set('fearfull', fearfullAI);
    ais.set('friendly', friendlyAI);
    return ais;

    function defaultAI(monster: Monster) {
        const dx = Math.abs(monster.pos.x - game.hero.pos.x);
        const dy = Math.abs(monster.pos.y - game.hero.pos.y);
        const hasVisibility = game.tilemap.hasVisibility({from: monster.pos, to: game.hero.pos});
        const distance = Math.max(dx,dy);
        if (distance > monster.sight + 2) {
            monster.asSeenHero = false;
            return randomAI(monster);
        } else if  (hasVisibility) {
            monster.asSeenHero = true;
            return agressiveAI(monster);
        } else if (monster.asSeenHero) {
            return agressiveAI(monster);
        } else {
            return randomAI(monster);
        }
    }

    function agressiveAI (monster: Monster) {
        const targets = getAttackablePlayerOrAllies(monster);
        const canAttack = targets.filter(t => {
            const hasVisibility = game.tilemap.hasVisibility({from: monster.pos, to: game.hero.pos});
            const dx = monster.pos.x - t.pos.x;
            const dy = monster.pos.y - t.pos.y;
            const range = Math.max(Math.abs(dx),Math.abs(dy));
            return (monster.weapon.maxRange >= range && hasVisibility)
        });
        
        if (canAttack.length > 0) {
            monsterAttack({
                target: canAttack[0],
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
        goAwayFromHero(monster);
    }

    function randomAI (monster: Monster) {
        randomMove(monster);
    }

    function friendlyAI(monster: Monster) {
        const scanner = scanEnnemies();
        if (scanner.status === true) {
            const target: Monster = scanner.res.pop() as Monster;
            const atk = attack(target);
            if (!atk) {
                const res = goTo({from: monster.pos, to: target.pos, game});
                if (!res.status) {
                    split();
                } else {
                    monsterMove({
                        game: game,
                        monster: monster,
                        nextPos: res.res
                    });
                }
            }
        } else {
            follow();
        }

        function follow(): boolean {
            const heroPos = game.hero.pos;
            const mePos = monster.pos;
            if ((Math.max(Math.abs(heroPos.x - mePos.x), Math.abs(heroPos.y - mePos.y))) == 1) {
                split();
                return false;
            }
            const nextMove = goTo({from: mePos, to: heroPos, game: game});
            if (!nextMove.status) {
                split();
                return false;
            } else {
                monsterMove({
                    game: game,
                    monster: monster,
                    nextPos: nextMove.res
                });
                return true;
            }
        }
        function attack(target: Monster) {
            return attackIfPossible(monster, target);
        }
        function exploreTerrain() {
            randomMove(monster);
        }
        function split() {
            goAwayFromHero(monster);
        }

        type ScanResult = {status: true, res: Monster[]} | {status: false, res: []};
        function scanEnnemies(): ScanResult {
            const enemies = getAttackable(monster);
            if (enemies.length > 0) {
                return {status: true, res: enemies}; 
            } else {
                return {status: false, res: []};
            }
        }
    }
    function getAttackablePlayerOrAllies(me: Monster) {
        let nearest = [];
        const poss: (Hero|Monster)[] = game.monsters.monstersArray().concat([game.hero as any]);

		for (const mob of poss) {
            const posA = mob.pos;
            const posB = me.pos;
            const dist = Math.max(Math.abs(posA.x - posB.x), Math.abs(posA.y - posB.y));
            if (dist <= me.sight 
                && game.tilemap.hasVisibility({from: posA, to: posB})) {
                nearest.push({dist, mob});
            }
        }

        return nearest
            .sort((a,b) => {
                return b.dist - a.dist;
            })
            .map(n => n.mob)
            .filter(m => {
                if (m instanceof Hero) return true;
                if (m instanceof Monster) return m.getFriendly()
            });
    }
    function getAttackable(me: Monster) {
        let nearest = [];
		for (const mob of game.monsters.monstersArray()) {
            const posA = mob.pos;
            const posB = me.pos;
            const dist = Math.max(Math.abs(posA.x - posB.x), Math.abs(posA.y - posB.y));
            if (dist <= me.sight 
                && game.tilemap.hasVisibility({from: posA, to: posB})) {
                nearest.push({dist, mob});
            }
        }

        return nearest
            .sort((a,b) => {
                return b.dist - a.dist;
            })
            .map(n => n.mob)
            .filter(m => !m.getFriendly());
    }
    function attackIfPossible(monster: Monster, target: Monster | Hero) {
        const hasVisibility = game.tilemap.hasVisibility({from: monster.pos, to: target.pos});
        const dx = monster.pos.x - target.pos.x;
        const dy = monster.pos.y - target.pos.y;
        const range = Math.max(Math.abs(dx),Math.abs(dy));
        if (monster.weapon.maxRange >= range && hasVisibility) {
            monsterAttack({
                target,
                monster,
            });
            return true;
        } else {
            return false;
        }
    }
    function randomMove(monster: Monster) {
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
        });
    }
    function goAwayFromHero(monster: Monster) {
        const heroPos = game.hero.pos;     
        const selfPos = monster.pos;

        const dir = relativePosition(selfPos, heroPos);
        console.log(dir)
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
        const e = [
            {x:selfPos.x+1, y: selfPos.y},
            {x:selfPos.x+1, y: selfPos.y+1},
            {x:selfPos.x+1, y: selfPos.y-1},
        ];
        const w = [
            {x:selfPos.x-1, y: selfPos.y},
            {x:selfPos.x-1, y: selfPos.y+1},
            {x:selfPos.x-1, y: selfPos.y-1},
        ];
        let nextMoves: Coordinate[]|any = {
            NE: ne,
            N:n,
            NW: nw,
            S: s,
            SW: sw,
            SE: se,
            E: e,
            W: w,
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
}

type GoTo = {status: true, res: Coordinate} | {status: false, res:null}
function goTo(arg:{from: Coordinate, to: Coordinate, game: Game}): GoTo {
    const {from, to, game} = arg;
    const otherMobsPositions = game
        .monsters
        .monstersArray()
        .map(m => m.pos)
        .concat([game.hero.pos])
        .filter(p => !equalsCoordinate(p, from) && !equalsCoordinate(p, to));
    const path = astar({
        from: from,
        to: to,
        tiles: game.tilemap.tiles,
        additionnalObstacle: otherMobsPositions
    });
    if (path.length > 0) {
        return {status: true, res: path[0]};
    } else {
        return {status: false, res: null};
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