import {GameEventType} from './events';

export interface GameMessage {
    type: GameEventType;
    data: any;
}