import { Monster } from "../monsters/monster";

export enum GameEventType {
    PlayerMove = 'playerMove',
    PlayerAttack = 'playerAttack',
    PlayerLoot = 'playerLoot',
    PlayerThrow = 'playerThrow',
    PlayerUseSkill = 'playerUseSkill',
    PlayerDrop = 'playerDrop',
    PlayerEquip = 'playerEquip',
    PlayerUnEquip = 'playerUnEquip',
    PlayerUseItem = 'playerUseItem',
    PlayerOpenDoor = 'playerOpenDoor',
    NextDungeonLevel = 'nextDungeonLevel',
    PlayerChoseSkill = 'playerChoseSkill',
    PlayerPrayGods = 'playerPrayGod',
    PlayerSwapWeapons = 'playerSwapWeapons'
}

export enum InternalEventType {
    MonsterDead = 'monsterDead',
    HeroDead = 'HeroDead',
    HeroGainXP = 'HeroGainXP',
    HeroLevelUp = 'HeroLvlUp',
    ItemApears = 'ItemApears'
}

export type GameEvent = MonterDeadEvent;

export interface MonterDeadEvent {
    type: InternalEventType.MonsterDead;
    data: {
        target: Monster 
    }
}