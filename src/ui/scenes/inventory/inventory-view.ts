import { InventoryFont } from "../inventory.scene";
import { ItemLine } from "./item-line.component";

export class InventoryView extends Phaser.GameObjects.Container {
    scroller: any;
    config;
    letters;

    totalHeight = 0;
    scrollDelta = 0;
    cursorPos = 0;
    scrollUp() {
        if (this.cursorPos === 0) return;
        this.cursorPos += 32;
        if (this.scrollDelta === 0) return;
        this.scroller.incY(+32)
        this.scrollDelta += 32;
    }
    scrollDown() {
        
        this.cursorPos -= 32;
        if (this.cursorPos > -350) {
            return;
        }
        if (this.scrollDelta < -(this.totalHeight)) {
            return;
        }
        this.scroller.incY(-32)
        this.scrollDelta -= 32;
    }

    inputs(args: {viewW: number, viewH: number, config: any, title: string}) {
        const {viewW, viewH, config, title} = args;
        this.config = config;

        var graphics = this.scene.add.graphics();
        graphics.fillStyle(0x666666, 1);
        graphics.fillRect(0, 0, viewW, viewH);

        this.add(graphics);

        let y = 0;
        let x = 0;
        y += 6;
        x += 6;

        const nextLine = () => y += 24;
        const halfLine = () => y += 24 / 2;

        this.letters = {};
        let currLetter = 'a'.charCodeAt(0);
        this.scroller = this.scene.add.group();
        this.add(this.scene.add.text(viewW / 2, y, title, InventoryFont).setOrigin(0.5, 0));
        nextLine();
        for (const section of this.config.sections) {
            const sectionTitle = this.scene.add.text(x, y, section, InventoryFont).setOrigin(0);
            this.add(sectionTitle);
            this.scroller.add(sectionTitle);
            nextLine();
            for (const item of this.config[section]) {
                const letter = String.fromCharCode(currLetter);
                const panelItem = new ItemLine(this.scene, x+16, y);
                panelItem.inputs({letter,item});
                this.letters[letter] = {
                    item: panelItem.getItem(),
                    txt: panelItem.getWeaponName()
                };
                currLetter++;
                this.add(panelItem);
                this.scroller.add(panelItem);
                nextLine();
            }
            halfLine();
        }
        this.totalHeight = y;
        return {letters: this.letters};
    }
}