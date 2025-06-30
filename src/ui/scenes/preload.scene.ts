import {
    SceneName
  } from "./scenes.constants";
import { PotionColors } from "../../game/items/potion";
import TweenHelper from "../../phaser-addition/tween-helper";

  class PreLoadScene extends Phaser.Scene {
    constructor() {
      super({
        key: SceneName.Preload,
      });
    }
  
    preload() {
      this.load.image('screen', '/assets/tilemaps/screen.png');
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
      this.load.image('Crab', '/assets/sprites/crab-red.png');
      this.load.image('Crab King', '/assets/sprites/crab-green.png');
      this.load.image('Pirate', '/assets/sprites/pirate.png');
      this.load.image('Sailor', '/assets/sprites/sailor.png');
      this.load.image('Pirate King', '/assets/sprites/pirate-boss.png');
      this.load.image('Wild cat', '/assets/sprites/cat-friend.png');
      this.load.image('Cat statue', '/assets/sprites/cat-statue.png');

      this.load.image('blood', '/assets/sprites/blood.png');

      this.load.image('Fire', '/assets/sprites/fire.png');
      this.load.image('Cold', '/assets/sprites/cold.png');
      this.load.image('Shadow', '/assets/sprites/shadow.png');
      this.load.image('Poison', '/assets/sprites/poison.png');
      this.load.image('Root', '/assets/sprites/root.png');
      this.load.image('Water', '/assets/sprites/water.png');
      this.load.image('Light', '/assets/sprites/light.png');
      this.load.image('Floral', '/assets/sprites/floral.png');

      this.load.image('target', '/assets/sprites/target.png');
      this.load.image('itemable', '/assets/sprites/itemable.png');
      this.load.image('friendly', '/assets/sprites/friend.png');
  
      this.load.image('Blowpipe', '/assets/sprites/blowpipe.png');
      this.load.image('rock', '/assets/sprites/rock.png');
      this.load.image('Fist', '/assets/sprites/fist.png');
      this.load.image('Slingshot', '/assets/sprites/slingshot.png');
      this.load.image('Short bow', '/assets/sprites/shortbow.png');
      this.load.image('Crossbow', '/assets/sprites/crossbow.png');
  
      this.load.image('armour-light', '/assets/sprites/armour-light.png');
      this.load.image('armour-heavy', '/assets/sprites/armour-heavy.png');
  
      this.load.image('Spikes', '/assets/sprites/spikes.png');
      this.load.image('Poison_Trap', '/assets/sprites/poison_trap.png');

      for (const c of PotionColors) {
        this.load.image(`potion-${c}`, `/assets/sprites/potion-${c}.png`);
      }
      this.load.image('scroll', '/assets/sprites/scroll-empty.png');
      this.load.image('scroll_sacrifice', '/assets/sprites/scroll-sacrifice.png');

      for (const w of ['fire','poison','water','identification','herb']) {
        this.load.image(`wand-${w}`, `/assets/sprites/wand-${w}.png`);
      }

      this.load.image('wildfire_bottle', '/assets/sprites/wildfire-bottle.png');
      this.load.image('sphere_of_shadows', '/assets/sprites/sphere-of-shadows.png');
      this.load.image('smelly_bottle', '/assets/sprites/poison-bottle.png');
      this.load.image('cold_crystal', '/assets/sprites/crystal.png');
      this.load.image('tome_of_rain', '/assets/sprites/tome-rain.png');
      this.load.image('tome_floral', '/assets/sprites/tome-floral.png');
      this.load.image('small_torch', '/assets/sprites/small-torch.png');
      this.load.image('sphere_of_lighting', '/assets/sprites/sphere-of-lightnings.png');
      this.load.image('unholy_book', '/assets/sprites/unholy-book.png');

      this.load.image('bleeding', '/assets/sprites/affect-bleeding.png');
      this.load.image('poisoning', '/assets/sprites/affect-poisoning.png');
      this.load.image('absorb_plus', '/assets/sprites/affect-absorbing.png');
      this.load.image('range_plus', '/assets/sprites/affect-ranging.png');
      this.load.image('movement_plus', '/assets/sprites/affect-speeding.png');
      

      /*rogue mode*/ 
      this.load.image('@', '/assets/sprites/@.png');
      this.load.image('Wizard', '/assets/sprites/w.png');
      this.load.image('Orc', '/assets/sprites/o.png');
      this.load.image('Skeleton', '/assets/sprites/s.png');
      this.load.image('rogue_tome', '/assets/sprites/rogue_tome.png');
      this.load.image('reality_tome', '/assets/sprites/tome-reality.png');
    }
    
    create() {
      this.game.scale.resize(1030, 761);
      this.add.image(0, 0, 'screen').setOrigin(0, 0).setDisplaySize(1030, 761);
      const txt = this.add.text((1030/2)-250,500,'Push space to start', {
        fontSize: '26px',
        fontFamily: 'square',
        color: '#FFFFFF',
      });
      txt.style.fixedWidth = 400;
      TweenHelper.flashElement(this, txt);
      this.input.keyboard.on('keydown-' + 'SPACE', () => {
        this.game.scale.resize(32*23, 32*17);
        this.scene.stop().launch(SceneName.Game);
      }); 
    }
  }
  
  
  export default PreLoadScene;