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
    pixelArt: true,
    scene: [
      GameScene
    ],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false
      }
  }
};

new Phaser.Game(config);
