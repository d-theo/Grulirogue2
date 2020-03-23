// events.ts
import { createEventDefinition, EventBus } from "ts-bus";
import { Monster } from "../game/monsters/monster";
import { Coordinate } from "../game/utils/coordinate";

export const gameBus = new EventBus();

export const gameStarted = createEventDefinition<{}>()('gameStarted');

export const doorOpened = createEventDefinition<{
    pos: Coordinate
}>()('doorOpened');

export const logPublished = createEventDefinition<{
    data: string;
}>()('logPublished');

export const sightUpdated = createEventDefinition<{
}>()('sightUpdated');

export const playerActionMove = createEventDefinition<{
    to: Coordinate
}>()("playerActionMove");

export const playerMoved = createEventDefinition<{
}>()("playerMove");

export const playerTookDammage = createEventDefinition<{
    amount: number,
    monster: Monster,
    baseHp: number,
    currentHp: number,
}>()("playerTookDammage");

export const monsterMoved = createEventDefinition<{
    monster: Monster
}>()("monsterMove");

export const monsterAttacked = createEventDefinition<{
    monster: Monster
}>()("monsterAttack");