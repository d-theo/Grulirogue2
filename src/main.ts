import 'phaser';
import GameScene from './scenes/game.scene';

import {test} from './hud';
import InventoryScene from './scenes/inventory.scene';
import SkillTreeScene from './scenes/skilltree.scene';
import GameOverScene from './scenes/gameover.scene';
import GameFinishedScene from './scenes/game-finished.scene';
import PreLoadScene from './scenes/preload.scene';

export const CellSize = 32;
export const W = CellSize*23;
export const H = CellSize*17;
export const GameFont = 'square';
export const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: W,
    height: H,
    resolution: 1, 
    backgroundColor: "#EDEEC9",
    pixelArt: true,
    transparent: true,
    scene: [
      PreLoadScene,
      GameScene,
      InventoryScene,
      SkillTreeScene,
      GameOverScene,
      GameFinishedScene
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