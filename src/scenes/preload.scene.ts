import {
    SceneName
  } from "./scenes.constants";
import { PotionColors } from "../game/items/potion";

  class PreLoadScene extends Phaser.Scene {
    constructor() {
      super({
        key: SceneName.Preload,
      });
    }
  
    preload() {
      this.load.image('terrain2', '/assets/tilemaps/tilemap2.png');
      this.load.image('hero', '/assets/sprites/hero.png');
      this.load.image('hero-heavy', '/assets/sprites/hero-heavy.png');
      this.load.image('hero-light', '/assets/sprites/hero-light.png');
      this.load.image('archer', '/assets/sprites/archer.png');
      this.load.image('health', '/assets/sprites/health.png');
      this.load.image('healthfull', '/assets/sprites/healthfull.png');
      this.load.image('Snake', '/assets/sprites/snake.png');
      this.load.image('Boar', '/assets/sprites/boar.png');
      this.load.image('Centaurus', '/assets/sprites/centaurus.png');
      this.load.image('Bat', '/assets/sprites/cavebat.png');
      this.load.image('Rat', '/assets/sprites/rat.png');
      this.load.image('Snake King', '/assets/sprites/snakeking.png');
  
  
      this.load.image('target', '/assets/sprites/target.png');
  
      this.load.image('Blowpipe', '/assets/sprites/blowpipe.png');
      this.load.image('rock', '/assets/sprites/rock.png');
      this.load.image('Fist', '/assets/sprites/fist.png');
      this.load.image('Slingshot', '/assets/sprites/slingshot.png');
      this.load.image('Short bow', '/assets/sprites/shortbow.png');
      this.load.image('Crossbow', '/assets/sprites/crossbow.png');
  
      this.load.image('armour-light', '/assets/sprites/armour-light.png');
      this.load.image('armour-heavy', '/assets/sprites/armour-heavy.png');
  
      this.load.image('Spikes', '/assets/sprites/spikes.png');
      for (const c of PotionColors) {
        this.load.image(`potion-${c}`, `/assets/sprites/potion-${c}.png`);
      }
      this.load.image('scroll', '/assets/sprites/scroll-empty.png');
    }
  
    create() {
      this.scene.stop().launch(SceneName.Game);
    }
  }
  
  
  export default PreLoadScene;