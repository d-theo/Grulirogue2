import { randomIn, Rect } from "../game/utils/rectangle";

export class TilemapItems {
    constructor(private itemLayer, private rooms:{
        roomId: number,
        groupId: number,
        rect: Rect,
        isEntry: boolean,
        isExit: boolean
    }[]) {}
    placeItems(itemKind, cb) {
        this.rooms.forEach(r => {
            if (r.isEntry || r.isExit) return;
            try {
                var rand = Math.random();
                if (rand > 0.5) return;
                if (r.rect.width > 2 && r.rect.height > 2) {
                    const pos = randomIn(r.rect,1);
                    this.itemLayer.putTilesAt(itemKind, pos.x, pos.y);
                    cb && cb(pos);
                }
            } catch(e){}
        });
    }
    placeItem(itemKind, chance ,cb) {
        this.rooms.forEach(r => {
            if (r.isEntry || r.isExit) return;
            try {
                var rand = Math.random();
                if (rand > chance) return;
                const pos = randomIn(r.rect, 1);
                this.itemLayer.putTileAt(itemKind, pos.x, pos.y);
                cb && cb(pos);
            } catch(e) {}
        });
    }
}