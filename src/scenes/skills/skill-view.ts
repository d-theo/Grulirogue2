import { SkillFont } from "../skilltree.scene";

export class SkillView extends Phaser.GameObjects.Container {
    scroller: any;
    config: {name: string, description: string; level:number; specialization: number}[];
    letters;
    graphics;
    inputs(args: {viewW: number, viewH: number, config: any}) {
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
        this.add(this.scene.add.text(viewW / 2, y, 'You can specialize in two domain at maximum', SkillFont).setOrigin(0.5, 0));
        nextLine();
        nextLine();

        const skillLine = this.scene.add.text(x, y, `skill name | level | training`, Object.assign({}, SkillFont, {wordWrap: {width: 300}})).setOrigin(0);
        this.add(skillLine);
        this.scroller.add(skillLine);
        nextLine();

        for (const skill of this.config) {
            const letter = String.fromCharCode(currLetter++);
            let txt;
            txt = `${letter} - ${skill.name} | ${skill.level} | ${this.formatSpecialization(skill.specialization)}`
            
            
            const skillLine = this.scene.add.text(x, y, txt, Object.assign({}, SkillFont, {wordWrap: {width: 300}})).setOrigin(0);
            this.add(skillLine);
            this.scroller.add(skillLine);
            this.letters[letter] = {
                item: skill,
                txt: skillLine
            };
            nextLine();
        }
        this.graphics = graphics;
        return {letters: this.letters};
    }

    refreshText(txt, letter, data) {
        txt.setText(`${letter} - ${data.name} | ${data.level} | ${this.formatSpecialization(data.specialization)}`);
    }
    formatSpecialization(n: number) {
        switch (n) {
            case 0: return '0%';
            case 1: return '50%';
            case 2: return '100%';
        }
    }
}