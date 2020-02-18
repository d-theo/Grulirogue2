import {GameEventType} from './events';
import { Coordinate } from '../utils/coordinate';

export type GameMessage = 
| PlayerMoveMessage
| PlayerAttackMessage

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