import {Monster} from './monster';
import { GameRange } from '../utils/range';
import { Game } from '../game';
import { monsterMove } from '../use-cases/monsterMove';
import { monsterAttack } from '../use-cases/monsterAttack';
import { astar } from '../tilemap/astar';

export type Behavior = (monster: Monster) => void;

export const AI = (game: Game) => {
    const ais = new Map<string, Behavior>();
    ais.set('agressive', agressiveAI);
    ais.set('blind', randomAI);
    return ais;

    function agressiveAI (monster: Monster) {
        const hasVisibility = game.tilemap.hasVisibility({from: monster.pos, to: game.hero.pos});

        const dx = Math.abs(monster.pos.x - game.hero.pos.x)
        const dy = Math.abs(monster.pos.y - game.hero.pos.y)
        const range = Math.max(dx,dy);

        if (monster.weapon.maxRange <= range && hasVisibility) {
            monsterAttack({
                hero: game.hero,
                monster
            });
        } else {
            const posAround = game.tilemap.subTitles({
                from: monster.pos,
                range: 10,
            });
            const path = astar({
                from: monster.pos,
                to: game.hero.pos,
                tiles: posAround
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

    function randomAI (monster: Monster) {
        const rand = new GameRange(0,1);
        const x = rand.pick();
        const y = rand.pick();
        const nextPos = {
            x: monster.pos.y+x,
            y: monster.pos.y+y
        };
        monsterMove({
            game: game,
            monster: monster,
            nextPos
        })
    }
}
