import { InventoryFont } from "../inventory.scene";

export class ItemLine extends Phaser.GameObjects.Container {
    weaponName;
    item;
    letter;
    inputs(args: {letter: string, item: any}) {
        const {letter, item} = args;
        this.item = item;
        this.letter = letter;
        const weapon1 = this.scene.add.text(0, 0, `${letter} | `, InventoryFont).setOrigin(0);
        const sprite = this.scene.add.sprite(30, -3, item.skin).setOrigin(0);
        sprite.setScale(0.7);
        this.weaponName = this.scene.add.text(60, 0, `${item.count ? item.count : ''} ${item.name}${item.equiped ? '(equiped)' : ''}`, InventoryFont).setOrigin(0);
        this.add(weapon1);
        this.add(sprite);
        this.add(this.weaponName);
    }
    getWeaponName() {
        return this.weaponName;
    }
    getItem() {
        return this.item;
    }
    getLetter() {
        return this.letter;
    }
}