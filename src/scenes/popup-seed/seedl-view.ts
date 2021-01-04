import { SkillFont } from "../skilltree.scene";

export interface ConfigPopup<T> {
    header?: string;
    title?: string;
    data: T[]; // rows
    rowFormatter: ((letter: string, element:T) => string);
}

export class PopupSeedView<T> extends Phaser.GameObjects.Container {
    scroller: any;
    config: ConfigPopup<T>;
    letters;
    graphics;
    inputs(args: {viewW: number, viewH: number, config: ConfigPopup<T>}) {
        const {viewW, viewH, config} = args;
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

        this.letters = {};
        let currLetter = 'a'.charCodeAt(0);
        this.scroller = this.scene.add.group();
        SkillFont.fontSize = '10px';
        this.add(this.scene.add.text(viewW / 2, y, this.config.title, SkillFont).setOrigin(0.5, 0));
        nextLine();
        nextLine();

        const skillLine = this.scene.add.text(x, y, this.config.header, Object.assign({}, SkillFont, {wordWrap: {width: 300}})).setOrigin(0);
        this.add(skillLine);
        this.scroller.add(skillLine);
        nextLine();

        for (const element of this.config.data) {
            const letter = String.fromCharCode(currLetter++);
            let txt;
            txt = this.config.rowFormatter(letter, element);
            
            
            const skillLine = this.scene.add.text(x, y, txt, Object.assign({}, SkillFont, {wordWrap: {width: 300}})).setOrigin(0);
            this.add(skillLine);
            this.scroller.add(skillLine);
            this.letters[letter] = {
                item: element,
                txt: skillLine
            };
            nextLine();
        }
        this.graphics = graphics;
        return {letters: this.letters};
    }

    refreshText(txt, letter, element) {
        txt.setText(this.config.rowFormatter(letter, element));
    }
}