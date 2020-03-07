import {GameEventType} from './events';
import { Coordinate } from '../utils/coordinate';
import { Item } from '../entitybase/item';

export type GameMessage = 
| PlayerMoveMessage
| PlayerAttackMessage
| PlayerUseSkillMessage
| PlayerLootMessage
| PlayerDropMessage
| PlayerThrowMessage
| PlayerEquipMessage
| PlayerUnEquipMessage
| PlayerUseItemMessage
| PlayerOpensDoorMessage
| NextDungeonLevelMessage
| PlayerChoseSkillMessage
| PlayerPrayGodsMessage
| PlayerSwapWeapon

export interface PlayerMoveMessage {
    type: GameEventType.PlayerMove;
    data: {
        to: Coordinate
    }
}
export interface PlayerAttackMessage {
    type: GameEventType.PlayerAttack,
    data: {
        to: Coordinate
    }
}
export interface PlayerUseSkillMessage {
    type: GameEventType.PlayerUseSkill,
    data: {
        to: Coordinate
    }
}

export interface PlayerLootMessage {
    type: GameEventType.PlayerLoot,
}
export interface PlayerDropMessage {
    type: GameEventType.PlayerDrop,
    data: {
        what: Item,
    }
}
export interface PlayerThrowMessage {
    type: GameEventType.PlayerThrow,
    data: {
        to: Coordinate,
        what: Item
    }
}
export interface PlayerEquipMessage {
    type: GameEventType.PlayerEquip,
    data: {
        what: Item
    }
}
export interface PlayerUnEquipMessage {
    type: GameEventType.PlayerUnEquip,
    data: {
        what: Item
    }
}
export interface PlayerUseItemMessage {
    type: GameEventType.PlayerUseItem,
    data: {
        what: Item,
        from: Coordinate,
        to: Coordinate
    }
}

export interface PlayerOpensDoorMessage {
    type: GameEventType.PlayerOpenDoor,
    data: {
        to: Coordinate
    }
}
export interface NextDungeonLevelMessage {
    type: GameEventType.NextDungeonLevel,
}

export interface PlayerChoseSkillMessage {
    type: GameEventType.PlayerChoseSkill,
}

export interface PlayerPrayGodsMessage {
    type: GameEventType.PlayerPrayGods,
}

export interface PlayerSwapWeapon {
    type: GameEventType.PlayerSwapWeapons
}