// events.ts
import { createEventDefinition, EventBus } from "ts-bus";
import { Monster } from "../game/monsters/monster";
import { Coordinate } from "../game/utils/coordinate";
import { Item } from "../game/entitybase/item";
import { Hero } from "../game/hero/hero";
import { MapEffect } from '../map/map-effect';
import { SkillNames } from "../game/hero/hero-skills";
import { Weapon } from "../game/items/weapon";
import { Armour } from "../game/items/armour";

export const gameBus = new EventBus();

export const gameStarted = createEventDefinition<{}>()('gameStarted');

export const nextLevelCreated = createEventDefinition<{
    level: number
}>()('nextLevelCreated');

export const xpHasChanged = createEventDefinition<{
    current: number;
    total: number;
    status: 'xp_gained' | 'level_up'
}>()('xpHasChanged');

export const doorOpened = createEventDefinition<{
    pos: Coordinate
}>()('doorOpened');

export const logPublished = createEventDefinition<{
    data: string;
    level?: 'warning'|'danger'|'neutral'|'success';
}>()('logPublished');

export const sightUpdated = createEventDefinition<{
}>()('sightUpdated');

export const playerActionMove = createEventDefinition<{
    to: Coordinate
}>()("playerActionMove");

export const playerMoved = createEventDefinition<{
}>()("playerMove");

export const itemPickedUp = createEventDefinition<{
    item: Item;
}>()('itemPickedUp');

export const itemDropped = createEventDefinition<{
    item: Item;
}>()('itemDropped');
export const itemRemoved = createEventDefinition<{
    item: Item;
}>()('itemRemoved');
export const playerTookDammage = createEventDefinition<{
    amount: number,
    monster?: Monster,
    source?: string,
    baseHp: number,
    currentHp: number,
}>()("playerTookDammage");

export const playerHealed = createEventDefinition<{
    baseHp: number,
    currentHp: number,
    isSilent?: boolean,
}>()("playerHealed");
export const monsterTookDamage = createEventDefinition<{
    monster: Monster,
    amount: number,
    baseHp: number,
    currentHp: number;
    externalSource?: any;
}>()('monsterTookDamage');

export const monsterMoved = createEventDefinition<{
    monster: Monster
}>()("monsterMove");

export const monsterDead = createEventDefinition<{
    monster: Monster
}>()("monsterDead");

export const effectSet = createEventDefinition<MapEffects>()('effectSet');
export const effectUnset = createEventDefinition<{
    id: string;
}>()('effectUnset');
export const heroGainedXp = createEventDefinition<{amount: number}>()('heroGainedXp');
export const playerUseSkill = createEventDefinition<{
    name: SkillNames
}>()('playerUseSkill');
export const itemEquiped = createEventDefinition<{
    weapon?: Weapon,
    armour?: Armour
}>()('itemEquiped');
export const enchantChanged = createEventDefinition<{
    report: string
}>()('enchantChanged');
export const heroTargetMonster = createEventDefinition<{
    monster: Monster,
}>()('heroTargetMonster');
export const monsterSpawned = createEventDefinition<{
    monster: Monster,
}>()('monsterSpawned');
export const gameOver = createEventDefinition<{}>()('gameOver');
export const gameFinished = createEventDefinition<{}>()('gameFinished');
export const rogueEvent = createEventDefinition<{}>()('rogueEvent');
export const endRogueEvent = createEventDefinition<{}>()('endRogueEvent');
type StaticEffet = {
    id: string,
    animation: 'static';
    pos: Coordinate;
    type: MapEffect;
}
type ThrowEffet = {
    animation: 'throw';
    from: Coordinate;
    to: Coordinate;
    type: MapEffect;
}

type MapEffects = StaticEffet | ThrowEffet;