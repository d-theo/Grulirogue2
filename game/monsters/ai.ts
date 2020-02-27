import {Monster} from './monster';
import { GameRange } from '../utils/range';
import { Game } from '../game';
import { monsterMove } from '../use-cases/monsterMove';

export const outOfLosAI = (game: Game) => (monster: Monster) => {
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

export const agressiveAI = (game: Game) => (monster: Monster) => {
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
    });
}

export const fearfullAI = (game: Game) => (monster: Monster) => {
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
    });
}