import { InventoryFont } from '../inventory.scene';
import { ItemLine } from './item-line.component';

export class InventoryDescriptionView extends Phaser.GameObjects.Container {
  scroller: any;
  config;
  letters;

  inputs(args: { viewW: number; viewH: number; selectedItem: any; selectedLetter: string }) {
    const { viewH, viewW, selectedItem, selectedLetter } = args;
    var graphics = this.scene.add.graphics();
    graphics.fillStyle(0x666666, 1);
    graphics.fillRect(0, 0, viewW, viewH);
    this.add(graphics);

    let x = 12;
    let y = 32;
    const line = new ItemLine(this.scene, x, y);
    line.inputs({ letter: selectedLetter, item: selectedItem });
    y += 64;
    const desc = this.scene.add.text(x, y, selectedItem.description, InventoryFont).setOrigin(0);
    const usage = this.scene.add
      .text(viewW / 2, viewH - 30, Object.values(selectedItem.keyDescription).join('/'), InventoryFont)
      .setOrigin(0.5, 0);
    this.add(line);
    this.add(desc);
    this.add(usage);
  }
}
