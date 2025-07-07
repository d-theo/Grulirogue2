import { GameRange } from "./range";

export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export function randomIn(rect: Rect, offset: number = 0) {
    const x = new GameRange(rect.x+1+offset, rect.x+rect.width-2-offset).pick();
    const y = new GameRange(rect.y+1+offset, rect.y+rect.height-2-offset).pick();
    return {x,y};
}