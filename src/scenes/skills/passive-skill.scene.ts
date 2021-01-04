import { ConfigPopup } from './../popup-seed/seedl-view';
import { PopupSeedScene } from "../popup-seed/popup-seed.scene";
import { SceneName } from "../scenes.constants";

export type Skill = {name: string, description: string; level:number, specialization: number};

export class SkillView implements ConfigPopup<Skill>{
    header = 'Skill | energy | chance to fail';
    title = 'Choose a skill to zap';
    data: Skill[];
    rowFormatter (letter: string, element: Skill): string {
        return `${letter} - ${element.name} | ${element.level} | ${this.formatSpecialization(element.specialization)}`
    };
    formatSpecialization(n: number) {
        switch (n) {
            case 0: return '0%';
            case 1: return '50%';
            case 2: return '100%';
        }
    }
    constructor(data: Skill[]) {
        this.data = data;
    }
}

export class SkillTreeScene extends PopupSeedScene<Skill> {
    action = 'pickSkill';

    constructor() {
        super({
            key: SceneName.SkillTreeScene,
        });
    }
    onSelectItem(item: Skill) {
        switch(item.specialization) {
            case 0:
            case 1:
                item.specialization ++;
              break;
            case 2: 
            item.specialization = 0;
              break;
          }
          let remainingPoint = 2;
          remainingPoint -= item.specialization;
          for (let d of this.config.data) {
            if (d.name === item.name) continue;
            if (remainingPoint - d.specialization < 0) {
              d.specialization = 0;
            } else {
              remainingPoint -= d.specialization;
            }
          }
          this.refresh();
    }
}

export default SkillTreeScene;