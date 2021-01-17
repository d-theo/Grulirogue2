import { PassiveSkill } from "./passive-skills";

export class ArmourPassiveSkill extends PassiveSkill {
    mapLevelValue: [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6];
    name: string = 'Armour';
    description: string = 'Improve the effectivness of your armours by reducing the bulk';
}