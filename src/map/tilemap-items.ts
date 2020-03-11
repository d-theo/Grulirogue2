import { randomIn } from "../game/utils/rectangle";

export class TilemapItems {
    constructor(private itemLayer, private rooms) {}
    placeItems(itemKind, cb) {
        this.rooms.forEach(r => {
            try {
                var rand = Math.random();
                if (rand > 0.5) return;
                if (r.rect.width > 2 && r.rect.height > 2) {
                    const pos = randomIn(r.rect,1);
                    this.itemLayer.putTilesAt(itemKind, pos.x, pos.y);
                    cb(pos);
                }
            } catch(e){}
        });
    }
    placeItem(itemKind, cb) {
        this.rooms.forEach(r => {
            try {
                var rand = Math.random();
                if (rand > 0.5) return;
                const pos = randomIn(r.rect, 1);
                this.itemLayer.putTileAt(itemKind, pos.x, pos.y);
                cb(pos);
            } catch(e) {}
        });
    }
}