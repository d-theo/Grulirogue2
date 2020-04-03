import {
  SceneName
} from "./scenes.constants";
import { InventoryView } from "./inventory/inventory-view";
import { InventoryDescriptionView } from "./inventory/inventory-description";
import { Item } from "../game/entitybase/item";

export const InventoryFont = {
  fontSize: '13px',
  fontFamily: 'Courier New',
  color: '#FFFFFF',
  wordWrap: {
    width: 310
  }
};

class InventoryScene extends Phaser.Scene {
  config: any;
  letters: any;
  currentSelected: string;
  alreadyLoaded = false;
  currentScreen: 'list' | 'detail' = 'list';

  w = 23 * 32;
  h = 17 * 32;
  halfw = this.w * 0.9;
  halfh = this.h * 0.9;

  constructor() {
    super({
      key: SceneName.Inventory,
    });
  }

  init(config: any) {
    this.letters = {};
    this.config = config;
    this.currentSelected = 'a';
    this.currentScreen = 'list';
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
    const viewPanel = new InventoryView(this, (this.w / 2) - (this.halfw / 2), (this.h / 2) - (this.halfh / 2));
    const {letters} = viewPanel.inputs({viewW: this.halfw, viewH: this.halfh, config: this.config});
    this.add.existing(viewPanel);

    this.letters = letters;

    const shape = this.make.graphics({});
    shape.fillRect((this.w / 2) - (this.halfw / 2), (this.h / 2) - (this.halfh / 2) , this.halfw, this.halfh);
    let mask = new Phaser.Display.Masks.GeometryMask(this, shape);
    viewPanel.setMask(mask);

    this.selectLine(this.currentSelected);
  }

  selectLine(a: string) {
    this.letters[a].txt.setColor('#ffff00');
  }
  unSelectLine(a: string) {
    this.letters[a].txt.setColor('#FFFFFF');
  }

  getCurrentItem() : Item & {count: number, equiped: boolean}{
    return this.letters[this.currentSelected].item;
  }

  registerInputs() {
    let panel;
    let selectedItem;

    const listener = this.input.keyboard.on('keyup', (event) => {
      if (this.currentScreen === 'list') {
        switch (event.key) {
          case 'ArrowDown':
            this.unSelectLine(this.currentSelected);
            this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)+1);
            try {
              this.selectLine(this.currentSelected);
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
            } catch (e) {
              this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)+1);
              this.selectLine(this.currentSelected);
            }
            break;
          case 'Enter':
            this.currentScreen = 'detail';
            selectedItem = this.letters[this.currentSelected].item;
            panel = new InventoryDescriptionView(this, (this.w / 2) - (this.halfw / 2), (this.h / 2) - (this.halfh / 2));
            panel.inputs({viewW: this.halfw, viewH: this.halfh, selectedItem: selectedItem, selectedLetter: this.currentSelected});
            this.add.existing(panel);
            break;
          case 'i':
            listener.clearCaptures();
            this.scene.resume(SceneName.Game);
            this.scene.stop(SceneName.Inventory);
            break;
          default:
            break;  
        }
      } else if (this.currentScreen === 'detail') {
        switch (event.key) {
          case 'Escape':
            this.currentScreen = 'list';
            panel.destroy();
            break;
          case 'i':
            this.scene.stop(SceneName.Inventory);
            this.scene.resume(SceneName.Game);
            break;
          default:
            const action = this.getCurrentItem().keyMapping[event.key];
            if (action) {
              this.scene.stop(SceneName.Inventory);
              this.scene.resume(SceneName.Game, {action: 'useItem', key: event.key, item: this.getCurrentItem()});
            }
            break;
        }
      }
    });
  }
}


export default InventoryScene;