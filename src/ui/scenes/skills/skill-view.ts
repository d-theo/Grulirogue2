import { SkillFont } from "../skilltree.scene";

export class SkillView extends Phaser.GameObjects.Container {
    scroller: any;
    config: {name: string, description: string; level:number, maxLevel: number, cooldown?: number}[];
    letters;
    inputs(args: {viewW: number, viewH: number, config: any, action: 'useSkill' | 'pickSkill'}) {
        const {viewW, viewH, config, action} = args;
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
        if (action === 'pickSkill') {
            SkillFont.fontSize = '10px';
            this.add(this.scene.add.text(viewW / 2, y, 'Congratulation, you level up ! Choose a specialization wisely', SkillFont).setOrigin(0.5, 0));
        }
        if (action === 'useSkill') {
            this.add(this.scene.add.text(viewW / 2, y, 'What do you want to do ?', SkillFont).setOrigin(0.5, 0));
        }
        nextLine();
        nextLine();
        for (const skill of this.config) {
            const letter = String.fromCharCode(currLetter++);
            let txt;
            if (action === 'pickSkill') {
                txt = `${letter} - ${skill.name} - ${skill.level} / ${skill.maxLevel}`
            }
            if (action === 'useSkill') {
                txt = `${letter} - ${skill.name} - Turns before next use: ${skill.cooldown}`
            }
            
            const skillLine = this.scene.add.text(x, y, txt, Object.assign({}, SkillFont, {wordWrap: {width: 300}})).setOrigin(0);
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