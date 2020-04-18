// events.ts
import { createEventDefinition, EventBus } from "ts-bus";
import { Monster } from "../game/monsters/monster";
import { Coordinate } from "../game/utils/coordinate";
import { Item } from "../game/entitybase/item";
import { Hero } from "../game/hero/hero";
import { MapEffect } from '../map/map-effect';
import { SkillNames } from "../game/hero/hero-skills";
import { Scroll } from "../game/items/scroll";
import { Weapon } from "../game/entitybase/weapon";
import { Armour } from "../game/entitybase/armour";
import { EnchantTable } from "../game/entitybase/enchantable";

export const gameBus = new EventBus();

export const gameStarted = createEventDefinition<{}>()('gameStarted');

export const waitATurn = createEventDefinition<{}>()('waitATurn');
export const nextLevel = createEventDefinition<{}>()('nextLevel');
export const nextLevelCreated = createEventDefinition<{
    level: number
}>()('nextLevelCreated');

export const playerChoseSkill = createEventDefinition<{
    name: string;
}>()('playerChoseSkill');

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

export const playerUseItem = createEventDefinition<{
    item: Item,
    owner: Hero,
    target: Monster | Hero,
    action: string,
}>()('playerUseItem');

export const itemPickedUp = createEventDefinition<{
    item: Item;
}>()('itemPickedUp');

export const itemDropped = createEventDefinition<{
    item: Item;
}>()('itemDropped');

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

export const effectSet = createEventDefinition<{
    name: string;
    pos: Coordinate;
    type: MapEffect;
}>()('effectSet');
export const effectUnset = createEventDefinition<{
    name: string;
}>()('effectUnset');

export const monsterAttacked = createEventDefinition<{
    monster: Monster
}>()("monsterAttack");
export const heroGainedXp = createEventDefinition<{amount: number}>()('heroGainedXp');
export const playerUseSkill = createEventDefinition<{
    name: SkillNames
}>()('playerUseSkill');

export const playerReadScroll = createEventDefinition<{
    item: Scroll,
    target: any
}>()('playerReadScroll');

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
export const gameOver = createEventDefinition<{}>()('gameOver');