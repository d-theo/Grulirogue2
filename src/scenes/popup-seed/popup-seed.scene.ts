import { SceneName } from "../scenes.constants";
import { PopupSeedView, ConfigPopup } from "./seedl-view";

export const Font = {
  fontSize: '8px',
  fontFamily: 'square',
  color: '#FFFFFF',
};

export interface ItemData {
  name: string;
  description: string;
}

export abstract class PopupSeedScene<T> extends Phaser.Scene {
  config: ConfigPopup<T>;
  abstract action: string;
  letters: any;
  currentSelected: string;
  alreadyLoaded = false;
  currentDescription: Phaser.GameObjects.Text;
  viewPanel: PopupSeedView<T>;
  w = 23 * 32;
  h = 17 * 32;
  halfw = this.w * 0.9;
  halfh = this.h * 0.9;

  inputOk = false;

  listener;

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
    const viewPanel = new PopupSeedView<T>(this, (this.w / 2) - (this.halfw / 2), (this.h / 2) - (this.halfh / 2));
    const {letters} = viewPanel.inputs({viewW: this.halfw, viewH: this.halfh, config: this.config});
    this.add.existing(viewPanel);

    this.letters = letters;

    const shape = this.make.graphics({});
    shape.fillRect((this.w / 2) - (this.halfw / 2), (this.h / 2) - (this.halfh / 2) , this.halfw, this.halfh);
    let mask = new Phaser.Display.Masks.GeometryMask(this, shape);
    viewPanel.setMask(mask);

    this.selectLine(this.currentSelected);
    const conf = Object.assign({}, Font, {wordWrap: {width: 330}});
    this.currentDescription = this.add.text(350, 78+((this.h / 2) - (this.halfh / 2)), this.getCurrentDescription(), conf);
    this.viewPanel = viewPanel;
  }

  selectLine(a: string) {
    this.letters[a].txt.setColor('#ffff00');
  }
  unSelectLine(a: string) {
    this.letters[a].txt.setColor('#FFFFFF');
  }
  refresh() {
    let idx = 0;
    for (let letter in this.letters) {
      this.viewPanel.refreshText(this.letters[letter].txt, letter, this.config.data[idx]);
      idx ++;
    }
  }

  getCurrentItem() : T {
    return this.letters[this.currentSelected].item;
  }

  getCurrentDescription(): string {
    return this.letters[this.currentSelected].item['description'];
  }

  abstract onSelectItem(item: T);
  abstract onLeave();

  leaveWithData(data) {
    this.listener.clearCaptures();
    this.scene.stop(this.scene.key);
    this.scene.resume(SceneName.Game, {action: this.action, data});
    this.inputOk = false;
  }

  leave() {
    this.listener.clearCaptures();
    this.scene.stop(this.scene.key);
    this.scene.resume(SceneName.Game);
    this.inputOk = false;
  }

  registerInputs() {
    this.listener = this.input.keyboard.on('keyup', (event) => {
        switch (event.key) {
          case 'ArrowDown':
            this.unSelectLine(this.currentSelected);
            this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)+1);
            try {
              this.selectLine(this.currentSelected);
              this.currentDescription.text = this.getCurrentDescription()
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
              this.currentDescription.text = this.getCurrentDescription();
              this.currentDescription.y -= 24;
            } catch (e) {
              this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)+1);
              this.selectLine(this.currentSelected);
            }
            break;
          case 'Enter':
            const selectedItem = this.getCurrentItem();
            this.onSelectItem(selectedItem);
            break;
          case 'Escape':
              this.onLeave();
              break;
          default:
            try {
              const selectedItem = this.letters[event.key].item;
              this.onSelectItem(selectedItem);
            } catch(e) {}
            break;
      }
    });
  }
}