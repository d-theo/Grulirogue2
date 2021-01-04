import { ConfigPopup } from './../popup-seed/seedl-view';
import { Zap, ZapReport } from "../../game/hero/zap/zaper";
import { PopupSeedScene } from "../popup-seed/popup-seed.scene";
import { SceneName } from "../scenes.constants";

export class ZapView implements ConfigPopup<ZapReport>{
    header = 'Skill | chance to fail';
    title = 'Choose a skill to zap';
    data: ZapReport[];
    rowFormatter (letter: string, element: Zap): string {
        return `${letter} - ${element.name}`
    };
    constructor(data: ZapReport[]) {
        this.data = data;
    }
}

export class ZapScene extends PopupSeedScene<ZapReport> {
    constructor() {
        super({
            key: SceneName.Zap,
        });
    }
    onSelectItem(item: ZapReport) {
        console.log(item);
    }
}