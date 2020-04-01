import {
  SceneName
} from "./scenes.constants";
import { ItemLine } from "./item-line.component";
import { Machine, interpret } from 'xstate';

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
  scroller: any;
  currentSelected: string;
  alreadyLoaded = false;
  stateMachine;
  currentState: string = 'inventory';

  constructor() {
    super({
      key: SceneName.Inventory,
    });
    const machine = {
      id: 'promise',
      initial: 'inventory',
      states: {
        inventory: {
          on: {
            DESCRIPTION: 'description',
            EXIT: 'exit'
          }
        },
        description: {
          on: {
            EXIT: 'inventory',
            ACTION_DONE: 'exit'  
          }
        },
        exit: {}
      }
    };
    this.stateMachine = interpret(Machine(machine)).onTransition(state => {
      this.currentState = state.value as string;
    });

    this.stateMachine.start();
  }

  init(config: any) {
    this.config = config;
    this.currentSelected = 'a';
  }

  preload() {
    if (this.alreadyLoaded) {
      return;
    }

    this.alreadyLoaded = true;
    this.registerInputs();
  }

  create() {
    const w = 23 * 32;
    const h = 17 * 32;
    const halfw = w * 0.9;
    const halfh = h * 0.9;
    this.cameras.main.setViewport(0, 0, w, h);
    this.cameras.main.setPosition(0, 0);
    let g = this.add.graphics();
    g.fillStyle(0x000000, 0.7);
    g.fillRect(0, 0, w, h);

    const panel = this.add.container((w / 2) - (halfw / 2), (h / 2) - (halfh / 2));
    var graphics = this.add.graphics();
    graphics.fillStyle(0x666666, 1);
    graphics.fillRect(0, 0, halfw, halfh);

    panel.add(graphics);

    let y = 0;
    let x = 0;
    y += 6;
    x += 6;

    const nextLine = () => y += 24;
    const halfLine = () => y += 24 / 2;

    this.letters = {};
    let currLetter = 'a'.charCodeAt(0);
    this.scroller = this.add.group();
    panel.add(this.add.text(halfw / 2, y, 'Inventory', InventoryFont).setOrigin(0.5, 0));
    nextLine();
    for (const section of this.config.sections) {
      const sectionTitle = this.add.text(x, y, section, InventoryFont).setOrigin(0);
      panel.add(sectionTitle);
      this.scroller.add(sectionTitle);
      nextLine();
      for (const item of this.config[section]) {
        const letter = String.fromCharCode(currLetter);
        const panelItem = new ItemLine(this, x+16, y);
        panelItem.inputs({letter,item});
        this.letters[letter] = {
          item: panelItem.getItem(),
          txt: panelItem.getWeaponName()
        };
        currLetter++;
        panel.add(panelItem);
        this.scroller.add(panelItem);
        nextLine();
      }
      halfLine();
    }

    const shape = this.make.graphics({});
    shape.fillRect((w / 2) - (halfw / 2), (h / 2) - (halfh / 2) , halfw, halfh);
    let mask = new Phaser.Display.Masks.GeometryMask(this, shape);
    panel.setMask(mask);

    this.selectLine(this.currentSelected);
  }

  selectLine(a: string) {
    this.letters[a].txt.setColor('#ffff00');
  }
  unSelectLine(a: string) {
    this.letters[a].txt.setColor('#FFFFFF');
  }

  registerInputs() {
    var leaveScene = this.input.keyboard.addKey('I');
    leaveScene.on('down', (event) => {
      this.scene.stop(SceneName.Inventory);
      this.scene.resume(SceneName.Game);                            
    });

    var down = this.input.keyboard.addKey('DOWN');
    down.on('up', (event) => {
      if (this.currentState !== 'inventory') {
        return
      }
        //this.scroller.incY(-32);
      this.unSelectLine(this.currentSelected);
      this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)+1);
      try {
        this.selectLine(this.currentSelected);
      } catch(e) {
        this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)-1);
        this.selectLine(this.currentSelected);
      }
    });
    var up = this.input.keyboard.addKey('UP');
    up.on('up', (event) => {
      if (this.currentState === 'inventory') {
        return;
      }
      //this.scroller.incY(32);
      this.unSelectLine(this.currentSelected);
      this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)-1);
      try {  
        this.selectLine(this.currentSelected);
      } catch (e) {
        this.currentSelected = String.fromCharCode(this.currentSelected.charCodeAt(0)+1);
        this.selectLine(this.currentSelected);
      }
    });

    let panel;
    let selectedItem;
    var examineItem = this.input.keyboard.addKey('ENTER');
    examineItem.on('up', (event) => {
      this.stateMachine.send('DESCRIPTION');

      const w = 23 * 32;
      const h = 17 * 32;
      const halfw = w * 0.9;
      const halfh = h * 0.9;
      panel = this.add.container((w / 2) - (halfw / 2), (h / 2) - (halfh / 2));
      var graphics = this.add.graphics();
      graphics.fillStyle(0x666666, 1);
      graphics.fillRect(0, 0, halfw, halfh);
      panel.add(graphics);
      selectedItem = this.letters[this.currentSelected].item;
      const line = new ItemLine(this, 10, 10);
      line.inputs({letter: this.currentSelected, item: selectedItem});
      selectedItem.description = "c'est cool ici";
      const desc = this.add.text(26, 50, selectedItem.description, InventoryFont).setOrigin(0);
      const usage = this.add.text(halfw/2, halfh-30, Object.values(selectedItem.keyDescription).join('/'), InventoryFont).setOrigin(0.5, 0);
      panel.add(line);
      panel.add(desc);
      panel.add(usage);

      var listeners = Object.keys(selectedItem.keyMapping).map(k => this.input.keyboard.addKey(k));
      for (let l of listeners) {
        l.on('up', (event) => {
          this.stateMachine.send('ACTION_DONE');
          event.originalEvent.key;
          Object.keys(selectedItem.keyMapping).map(k => this.input.keyboard.removeKey(k));
          panel.destroy();
        });
      }
    });
    var leaveDescScreen = this.input.keyboard.addKey('ESC');
    leaveDescScreen.on('up', (event) => {
      this.stateMachine.send('EXIT');
      Object.keys(selectedItem.keyMapping).map(k => this.input.keyboard.removeKey(k));
      panel.destroy();
    });
  }
}

export default InventoryScene;