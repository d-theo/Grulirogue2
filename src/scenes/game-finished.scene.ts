import {
    SceneName
  } from "./scenes.constants";
import { CellSize } from "../main";
 const Font = {
  fontSize: '13px',
  fontFamily: 'square',
  color: '#FFFFFF',
  wordWrap: {
    width: 310
  }
};
  class GameFinishedScene extends Phaser.Scene {
  
    w = 23 * CellSize;
    h = 17 * CellSize;
    halfw = this.w * 0.9;
    halfh = this.h * 0.9;
  
    constructor() {
      super({
        key: SceneName.GameFinished,
      });
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

      this.add.text(230,250, 'You are a true hero,', Font);
      this.add.text(230,280, 'and you found your cat!', Font);
      this.add.text(230,310, 'Thank you for playing :-)', Font);

      this.add.sprite(320, 360, 'hero');
      this.add.sprite(355, 360, 'archer');
    }
  }
  
  
  export default GameFinishedScene;