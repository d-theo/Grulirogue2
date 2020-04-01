// events.ts
import { createEventDefinition, EventBus } from "ts-bus";
import { Monster } from "../game/monsters/monster";
import { Coordinate } from "../game/utils/coordinate";
import { Item } from "../game/entitybase/item";
import { Hero } from "../game/hero/hero";

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

export const playerUseItem = createEventDefinition<{
    item: Item,
    target: Monster | Hero,
}>()('playerUseItem');

export const itemPickedUp = createEventDefinition<{
    item: Item;
}>()('itemPickedUp');

export const itemDropped = createEventDefinition<{
    item: Item;
}>()('itemDropped');

export const playerTookDammage = createEventDefinition<{
    amount: number,
    monster: Monster,
    baseHp: number,
    currentHp: number,
}>()("playerTookDammage");

export const playerHealed = createEventDefinition<{
}>()("playerHealed");

export const playerAttackedMonster = createEventDefinition<{
    amount: number,
    monster: Monster,
    baseHp: number,
    currentHp: number;
}>()('playerAttackedMonster');

export const playerAttemptAttackMonster = createEventDefinition<{
    monster: Monster,
}>()('playerAttemptAttackMonster');

export const monsterMoved = createEventDefinition<{
    monster: Monster
}>()("monsterMove");

export const monsterDead = createEventDefinition<{
    monster: Monster
}>()("monsterDead");

export const monsterAttacked = createEventDefinition<{
    monster: Monster
}>()("monsterAttack");