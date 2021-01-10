import { ConfigPopup } from './../popup-seed/seedl-view';
import { ZapReport } from "../../game/hero/zap/zaper";
import { PopupSeedScene } from "../popup-seed/popup-seed.scene";
import { SceneName } from "../scenes.constants";

export class ZapView implements ConfigPopup<ZapReport>{
    header = 'zap | energy | fail %';
    title = 'Choose a skill to zap';
    data: ZapReport[];
    rowFormatter (letter: string, element: ZapReport): string {
        return `${letter}- ${element.name} | ${element.energyNeeded} | ${element.failChance}`
    };
    constructor(data: ZapReport[]) {
        this.data = data;
    }
}

export class ZapScene extends PopupSeedScene<ZapReport> {
    action = 'zap';

    constructor() {
        super({
            key: SceneName.Zap,
        });
    }
    onSelectItem(zap: ZapReport) {
        console.log(zap);
        this.leaveWithData(zap);
    }
    onLeave() {
        this.leave();
    }
}