import { SkillFont } from "../skilltree.scene";

export class SkillView extends Phaser.GameObjects.Container {
    scroller: any;
    config: {name: string, description: string; level:number, maxLevel: number}[];
    letters;
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
        this.add(this.scene.add.text(viewW / 2, y, 'Congrutalation, you level up ! Choose a specialization wisely', SkillFont).setOrigin(0.5, 0));
        nextLine();
        nextLine();
        for (const skill of this.config) {
            const letter = String.fromCharCode(currLetter++);
            const txt = `${letter} - ${skill.name} - ${skill.level} / ${skill.maxLevel}`
            const skillLine = this.scene.add.text(x, y, txt, SkillFont).setOrigin(0);
            this.add(skillLine);
            this.scroller.add(skillLine);
            this.letters[letter] = {
                item: skill,
                txt: skillLine
            };
            nextLine();
        }
        return {letters: this.letters};
    }
}