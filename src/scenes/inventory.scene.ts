import {
  SceneName
} from "./scenes.constants";

class InventoryScene extends Phaser.Scene {
  config: any;
  letters: any;
  scroller: any;
  currentSelected: string;
  constructor() {
    super({
      key: SceneName.Inventory,
    });
  }

  init(config: any) {
    this.config = config;
    this.currentSelected = 'a';
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
    const font = {
      fontSize: '13px',
      fontFamily: 'Courier New',
      color: '#FFFFFF',
      wordWrap: {
        width: 310
      }
    };
    this.scroller = this.add.group();
    panel.add(this.add.text(halfw / 2, y, 'Inventory', font).setOrigin(0.5, 0));
    nextLine();
    for (const section of this.config.sections) {
      const sectionTitle = this.add.text(x, y, section, font).setOrigin(0);
      panel.add(sectionTitle);
      this.scroller.add(sectionTitle);
      nextLine();
      for (const item of this.config[section]) {
        const letter = String.fromCharCode(currLetter);
        const panelItem = this.add.container(x + 16, y);
        const weapon1 = this.add.text(0, 0, `${letter} | `, font).setOrigin(0);
        const sprite = this.add.sprite(30, -3, item.skin).setOrigin(0);
        sprite.setScale(0.7);
        const weaponName = this.add.text(60, 0, `${item.name}${item.equiped ? '(equiped)' : ''}`, font).setOrigin(0);
        this.letters[letter] = {
          id: item.id,
          txt: weaponName
        };
        currLetter++;
        panelItem.add(weapon1);
        panelItem.add(sprite);
        panelItem.add(weaponName);
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

    this.registerInputs();
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
  }
}

export default InventoryScene;