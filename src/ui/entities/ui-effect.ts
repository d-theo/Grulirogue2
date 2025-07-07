import { Scene } from 'phaser';
import { toPix } from '../../utils/maths/maps-utils';
import { Coordinate } from '../../utils/coordinate';

export class UIEffect {
  sprite: any;
  constructor(
    private readonly parentScene: Scene,
    public subject: { name: string; pos: Coordinate },
    private imageKey
  ) {
    this.sprite = this.parentScene.physics.add.sprite(toPix(subject.pos.x), toPix(subject.pos.y), imageKey);
    this.sprite.setOrigin(0, 0);
    this.sprite.alpha = 0.8;
    this.sprite.setDepth(1);
  }
  pickedUp() {
    this.sprite.destroy();
  }
  destroy() {
    this.sprite.destroy();
  }

  throwProjectile(to: Coordinate) {
    this.sprite.setDepth(3);
    this.parentScene.tweens.add({
      targets: this.sprite,
      ease: 'Linear',
      duration: 80,
      repeat: 0,
      yoyo: false,
      x: { from: this.sprite.x, to: toPix(to.x) },
      y: { from: this.sprite.y, to: toPix(to.y) },
    });
    setTimeout(() => {
      this.destroy();
    }, 100);
  }
}
