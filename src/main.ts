import 'phaser';
import GameScene from './scenes/game.scene';
import HudScene from './scenes/hud.scene';

import {test} from './hud';

export const CellSize = 32;
export const Los = 8;
export const W = CellSize*23;
export const H = CellSize*17;
export const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: W,
    height: H,
    resolution: 1, 
    backgroundColor: "#EDEEC9",
    pixelArt: true,
    fps: 30,
    scene: [
      GameScene,
      //HudScene
    ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y:0}
      }
  }
};

const game = new Phaser.Game(config);
test();