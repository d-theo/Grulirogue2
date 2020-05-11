import {
    SceneName
  } from "./scenes.constants";
import { GameFont } from "../main";
 const Font = {
  fontSize: '13px',
  fontFamily: GameFont,
  color: '#FFFFFF',
  wordWrap: {
    width: 310
  }
};
  class GameOverScene extends Phaser.Scene {
  
    w = 23 * 32;
    h = 17 * 32;
    halfw = this.w * 0.9;
    halfh = this.h * 0.9;
  
    constructor() {
      super({
        key: SceneName.GameOver,
      });
    }
  
    init(config: any) {

    }
  
    preload() {
      
    }
  
    create() {
      this.cameras.main.setViewport(0, 0, this.w, this.h);
      this.cameras.main.setPosition(0, 0);
      let g = this.add.graphics();
      g.fillStyle(0x000000, 0.7);
      g.fillRect(0, 0, this.w, this.h);

      var graphics = this.add.graphics();
      graphics.fillStyle(0x666666, 1);
      graphics.fillRect(0, 0, this.w, this.h);

      this.add.text(230,250, 'GAME OVER (Refresh to replay)', Font);
      this.add.text(230,280, 'and your cat is lost...', Font);
    }
  }
  
  
  export default GameOverScene;