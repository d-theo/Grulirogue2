import { ItemVisitor } from "../items/item-visitor";
import { EffectTarget, IEffect } from "../effects/effects";
import { Item, ItemArgument } from "../entitybase/item";

/*
regen
vitesse
hp
bulky

*/

export class Armour extends Item implements ItemArgument{
    public baseAbsorb: number;
    public bulky: number;
    constructor(arg: any) { // Todo
        super(arg);
        this.isConsumable = false;
        this.baseAbsorb = arg.baseAbsorb || 0;
        this.bulky = arg.bulky || 0;
        this.keyMapping['w'] = this.use.bind(this);
        this.keyDescription['w'] = '(w)ear';
    }
    get description(): string {
        if (this.identified) {
            return `${this._description} - absorb : ${this.baseAbsorb}`;
        } else {
            return `An unidentified ${this.skin}`
        }
    }
    /*public effectOnCarry(target: Hero|Monster) {
        this.additionnalEffectsOnCarry.forEach(e => {
            e.effect.cast(target);
        });
    }
    drop(target: Hero) {
        super.drop(target);
        /*this.additionnalEffectsOnCarry.forEach(effect => {
            target.buffs.detachBuff(effect.effect);
        })*/
        /*target.dropItem(this);
        gameBus.publish(itemDropped({
            item: this
        }));
    }*/
    get name() {
        if (this.identified) {
            return this._name;
        } else {
            return `An unidentified ${this.skin}`
        }
    }
    use(target: any) {
        target.equip(this);
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