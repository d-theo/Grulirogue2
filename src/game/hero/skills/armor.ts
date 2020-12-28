import { PassiveSkill } from "./passive-skills";

export class ArmorPassiveSkill extends PassiveSkill {
    name: string = 'Armour';
    description: string = 'Improve the effectivness of your armours by reducing the bulk';
    onLevelUp(level: number) {
        throw new Error('Method not implemented.');
    }

}