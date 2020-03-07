import 'phaser';
import {Game} from './game/game';

import GameScene from './scenes/game.scene';

const config:GameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1280,
    height: 720,
    resolution: 1, 
    backgroundColor: "#EDEEC9",
    scene: [
      GameScene
    ],
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 }
      }
  }
};

new Phaser.Game(config);
