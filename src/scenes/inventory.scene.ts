import { SceneName } from "./scenes.constants";

class InventoryScene extends Phaser.Scene {
  Font = '15px Arial';
  Line = 20;
	constructor() {
    super({
      key: SceneName.Inventory,
		});
    }
    preload() {
		console.log('preload hud');
    }
    create() {
        console.log('CREATE hud');
        this.cameras.main.setViewport(1280-300,0,300,720);
        this.cameras.main.setPosition(1280-300, 0);
        let g = this.add.graphics();
        g.fillStyle(0x000000, 1);
        g.fillRect(0, 0, 300,720);
    }
}

export default InventoryScene;