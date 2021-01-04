import {
    SceneName
  } from "./scenes.constants";
import { SkillView } from "./skills/skill-view";
  export const SkillFont = {
    fontSize: '11px',
    fontFamily: 'square',
    color: '#FFFFFF',
  };
  type Skill = {name: string, description: string; level:number, specialization: number};
  class SkillTreeScene extends Phaser.Scene {
    config: Skill[];
    action = 'pickSkill';
    letters: any;
    currentSelected: string;
    alreadyLoaded = false;
    currentDescription: Phaser.GameObjects.Text;
    viewPanel: SkillView;
    w = 23 * 32;
    h = 17 * 32;
    halfw = this.w * 0.9;
    halfh = this.h * 0.9;
  
    inputOk = false;
    constructor() {
      super({
        key: SceneName.SkillTreeScene,
      });
    }
  
    init(config: any) {
      setTimeout(() => {this.inputOk = true}, 1000);
      this.letters = {};
      this.config = config.data;
      this.action = config.action;
      this.currentSelected = 'a';
      this.input.keyboard.enabled = true;
    }
  
    preload() {
      this.registerInputs();
    }
  
    create() {
      this.cameras.main.setViewport(0, 0, this.w, this.h);
      this.cameras.main.setPosition(0, 0);
      let g = this.add.graphics();
      g.fillStyle(0x000000, 0.7);
      g.fillRect(0, 0, this.w, this.h);
      const viewPanel = new SkillView(this, (this.w / 2) - (this.halfw / 2), (this.h / 2) - (this.halfh / 2));
      const {letters} = viewPanel.inputs({viewW: this.halfw, viewH: this.halfh, config: this.config});
      this.add.existing(viewPanel);

      this.letters = letters;
  
      const shape = this.make.graphics({});
      shape.fillRect((this.w / 2) - (this.halfw / 2), (this.h / 2) - (this.halfh / 2) , this.halfw, this.halfh);
      let mask = new Phaser.Display.Masks.GeometryMask(this, shape);
      viewPanel.setMask(mask);
  
      this.selectLine(this.currentSelected);
      const conf = Object.assign({}, SkillFont, {wordWrap: {width: 330}});
      this.currentDescription = this.add.text(350, 78+((this.h / 2) - (this.halfh / 2)), this.getCurrentItem().description, conf);

      this.viewPanel = viewPanel;
    }
  
    selectLine(a: string) {
      this.letters[a].txt.setColor('#ffff00');
    }
    unSelectLine(a: string) {
      this.letters[a].txt.setColor('#FFFFFF');
    }
    refreshLine(a: string, newData: Skill) {
      let idx = 0;
      for (let letter in this.letters) {
        this.viewPanel.refreshText(this.letters[letter].txt, letter, this.config[idx]);
        idx ++;
      }
    }
  
    getCurrentItem() : Skill {
      return this.letters[this.currentSelected].item;
    }

    updateItem(selectedItem) {
      switch(selectedItem.specialization) {
        case 0:
        case 1:
          selectedItem.specialization ++;
          break;
        case 2: 
          selectedItem.specialization = 0;
          break;
      }
      let remainingPoint = 2;
      remainingPoint -= selectedItem.specialization;
      for (let d of this.config) {
        if (d.name === selectedItem.name) continue;
        if (remainingPoint - d.specialization < 0) {
          d.specialization = 0;
        } else {
          remainingPoint -= d.specialization;
        }
      }
      this.refreshLine(this.currentSelected, selectedItem);
    }
  
    registerInputs() {
      const listener = this.input.keyboard.on('keyup', (event) => {
          switch (event.key) {
            case 'ArrowDown':
              this.unSelectLine(this.currentSelected);
              this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)+1);
              try {
                this.selectLine(this.currentSelected);
                this.currentDescription.text = this.getCurrentItem().description;
                this.currentDescription.y += 24;
              } catch(e) {
                this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)-1);
                this.selectLine(this.currentSelected);
              }
              break;
            case 'ArrowUp':
              this.unSelectLine(this.currentSelected);
              this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)-1);
              try {  
                this.selectLine(this.currentSelected);
                this.currentDescription.text = this.getCurrentItem().description;
                this.currentDescription.y -= 24;
              } catch (e) {
                this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)+1);
                this.selectLine(this.currentSelected);
              }
              break;
            case 'Enter':
              const selectedItem = this.getCurrentItem();
              this.updateItem(selectedItem);
              break;
            case 'Escape':
                listener.clearCaptures();
                this.scene.stop(SceneName.SkillTreeScene);
                this.scene.resume(SceneName.Game, {action: this.action, skills:this.config});
                this.inputOk = false;
                break;
            default:
              try {
                const selectedItem = this.letters[event.key].item;
                this.updateItem(selectedItem);
              } catch(e) {}
              break;
        }
      });
    }
  }
  
  
  export default SkillTreeScene;