import 'phaser';
import GameScene from './ui/scenes/game.scene';

import { hud } from './ui/hud';
import InventoryScene from './ui/scenes/inventory.scene';
import SkillTreeScene from './ui/scenes/skilltree.scene';
import GameOverScene from './ui/scenes/gameover.scene';
import GameFinishedScene from './ui/scenes/game-finished.scene';
import PreLoadScene from './ui/scenes/preload.scene';

export const CellSize = 32;
export const W = CellSize * 23;
export const H = CellSize * 17;
export const config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: W,
  height: H,
  resolution: 1,
  backgroundColor: '#EDEEC9',
  pixelArt: true,
  transparent: true,
  scene: [PreLoadScene, GameScene, InventoryScene, SkillTreeScene, GameOverScene, GameFinishedScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
};

const game = new Phaser.Game(config);
hud();
