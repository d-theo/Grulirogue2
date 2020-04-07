import {
    SceneName
  } from "./scenes.constants";
import { W, H } from "../main";
import {Game as GameEngine} from '../game/game';
import { gameBus, nextLevel } from "../eventBus/game-bus";
import GameScene from "./game.scene";
  class InterLevelScene extends Phaser.Scene {  
    constructor() {
      super({
        key: SceneName.InterLevel,
      });
    }
  
    preload() {}
  
    create() {
      console.log('create interscene');
      this.cameras.main.setViewport(0, 0, W, H);
      this.cameras.main.setPosition(0, 0);
      let g = this.add.graphics();
      g.fillStyle(0x0000FF, 1);
      g.fillRect(0, 0, W, H);
      gameBus.publish(nextLevel({}));
      setTimeout(() => {
        const gs: GameScene = this.scene.get(SceneName.Game) as GameScene;
        this.scene.run(SceneName.Game);
        gs.reInit();
        this.scene.stop();
      },1000);
    }
  }
  export default InterLevelScene;