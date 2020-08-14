import { ItemVisitor } from "../items/item-visitor";
import { EffectTarget } from "../effects/spells";
import { Item, ItemArgument } from "../entitybase/item";
import { BuffDefinition } from "../effects/effect";
import { Hero } from "../hero/hero";

/*
regen
vitesse
hp
bulky

*/

export class Armour extends Item implements ItemArgument{
    public baseAbsorb: number;
    public additionalAbsorb: number= 0;
    public additionalName: string[] = [];
    public additionalDescription: string[] = [];
    public bulky: number;
    public onEquipBuffs: BuffDefinition[] = [];
    public hitBeforeIdentified = 200;
    constructor(arg: any) { // Todo
        super(arg);
        this.isConsumable = false;
        this.baseAbsorb = arg.baseAbsorb || 0;
        this.bulky = arg.bulky || 0;
        this.keyMapping['w'] = this.use.bind(this);
        this.keyDescription['w'] = '(w)ear';
        this.onEquipBuffs = arg.onEquipBuffs || [];
    }
    get description(): string {
        if (this.identified) {
            let s = '';
            s += `Armour class: ${this.baseAbsorb} ${this.additionalAbsorb > 0? '+':''}${this.additionalAbsorb !== 0 ? this.additionalAbsorb : ''}`;
            s += '\n\n';
            s += `${this.additionalDescription.join("\n")}`;
            return s;
        } else {
            return `An unidentified ${this._name}`
        }
    }
    
    get name() {
        if (this.identified) {
            return this._name + ' '+ this.additionalName.join(' ');
        } else {
            return `An unidentified ${this._name}`
        }
    }
    use(target: Hero) {
        target.equip(this);
        this.onEquipBuffs.forEach(b => {
            b.source = this.id;
            target.addBuff(b);
        });
    }
    onUnEquip(target: Hero) {
        this.onEquipBuffs.forEach(b => target.buffs.cleanBuffSource(this.id));
    }
    visit(itemVisitor: ItemVisitor) {
        return itemVisitor.visitArmor(this);
    }
    reveal() {
        this.identified = true;
    }
    getArgumentForKey(key: string) {
        return EffectTarget.Hero;
    }
}

export const NullArmour = new Armour({baseAbsorb: 0, name: '', description: ''});