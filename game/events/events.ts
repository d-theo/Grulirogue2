import { Monster } from "../monsters/monster";

export enum GameEventType {
    PlayerMove = 'playerMove',
    PlayerAttack = 'playerAttack'
}

export enum InternalEventType {
    MonsterDead = 'monsterDead',
}

export type GameEvent = MonterDeadEvent;

export interface MonterDeadEvent {
    type: InternalEventType.MonsterDead;
    data: {
        target: Monster 
    }
}