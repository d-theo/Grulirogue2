import {
    SceneName
  } from "./scenes.constants";
  import { Item } from "../game/entitybase/item";
import { SkillView } from "./skills/skill-view";
  
  export const SkillFont = {
    fontSize: '13px',
    fontFamily: 'Courier New',
    color: '#FFFFFF',
  };
  type Skill = {name: string, description: string; level:number, maxLevel: number};
  class SkillTreeScene extends Phaser.Scene {
    config: Skill[];
    action: 'useSkill' | 'pickSkill';
    letters: any;
    currentSelected: string;
    alreadyLoaded = false;
    currentDescription: Phaser.GameObjects.Text;

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
      const {letters} = viewPanel.inputs({viewW: this.halfw, viewH: this.halfh, config: this.config, action: this.action});
      this.add.existing(viewPanel);

      this.letters = letters;
  
      const shape = this.make.graphics({});
      shape.fillRect((this.w / 2) - (this.halfw / 2), (this.h / 2) - (this.halfh / 2) , this.halfw, this.halfh);
      let mask = new Phaser.Display.Masks.GeometryMask(this, shape);
      viewPanel.setMask(mask);
  
      this.selectLine(this.currentSelected);
      const conf = Object.assign({}, SkillFont, {wordWrap: {width: 330}});
      this.currentDescription = this.add.text(350, 72, this.getCurrentItem().description, conf);
    }
  
    selectLine(a: string) {
      this.letters[a].txt.setColor('#ffff00');
    }
    unSelectLine(a: string) {
      this.letters[a].txt.setColor('#FFFFFF');
    }
  
    getCurrentItem() : Skill {
      return this.letters[this.currentSelected].item;
    }
  
    registerInputs() {
      let panel;
      let selectedItem:Skill;
  
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
              selectedItem = this.getCurrentItem();
              listener.clearCaptures();
              const data = {action: this.action, item: selectedItem};
              if (this.action === 'pickSkill' && selectedItem.level === selectedItem.maxLevel) return;
              this.scene.stop(SceneName.SkillTreeScene);
              this.scene.resume(SceneName.Game, data);
              this.inputOk = false;
              break;
            case 'Escape':
              if (this.action === 'pickSkill') return;
              listener.clearCaptures();
              this.scene.resume(SceneName.Game);
              this.scene.stop(SceneName.SkillTreeScene);
              this.inputOk = false;
              break;
            default:
              try {
                selectedItem = this.letters[event.key].item;
                if (!this.inputOk || !selectedItem) throw new Error('no letter');
                const data = {action: this.action, item: selectedItem};
                if (this.action === 'pickSkill' && selectedItem.level === selectedItem.maxLevel) return;
                listener.clearCaptures();
                this.scene.stop(SceneName.SkillTreeScene);
                this.scene.resume(SceneName.Game, data);
                this.inputOk = false;
              } catch(e){}
              break;     
        }
      });
    }
  }
  
  
  export default SkillTreeScene;