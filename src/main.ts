import 'phaser';
import GameScene from './scenes/game.scene';

const config = {
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
        gravity: {y:0}
      }
  }
};

new Phaser.Game(config);
