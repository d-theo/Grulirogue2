import { SpellMaker, SpellNames } from '../../content/spells/spell-factory';
import { CleaningEffect, XPEffect } from '../../content/spells/spells';
import { Conditions } from '../../content/conditions/conditions';
import { Buff2 } from '../../game/entitybase/buff';
import { Hero } from '../../game/hero/hero';

export const Potions = {
  Thickness: {
    name: 'thickness potion',
    description: 'A potion that makes your skin thicker but also slower',
    effect: (t: Hero) => t.addBuff(Buff2.create(Conditions.thicc).setTurns(15)),
  },
  Health: {
    name: 'health potion',
    description: 'Smells bad, taste bad but it should works',
    effect: (t: Hero) => t.addBuff(Buff2.create(Conditions.heal).setTurns(1)),
  },
  Dodge: {
    name: 'potion of agility',
    description: 'A potion that makes you more agile but also more fragile',
    effect: (t: Hero) => t.addBuff(Buff2.create(() => Conditions.dodge({ dodgeBonus: 0.3 })).setTurns(15)),
  },
  Blindness: {
    name: 'potion of blindness',
    description: 'A very old alcoholic drink. It could makes you blind...',
    effect: (t: Hero) => t.addBuff(Buff2.create(() => Conditions.blind({ sightMalus: 6 })).setTurns(15)),
  },
  Immobilisation: {
    name: 'potion of immobilisation',
    description: 'A potion that looks quite useless',
    effect: (t: Hero) => t.addBuff(Buff2.create(Conditions.stun).setTurns(5)),
  },
  Accuracy: {
    name: 'accuraty potion',
    description: 'Makes your mind more focus',
    effect: (t: Hero) => t.addBuff(Buff2.create(Conditions.accurate).setTurns(15)),
  },
  Speed: {
    name: 'Potion of celerity',
    description: 'A potion that makes you run faster',
    effect: (t: Hero) => t.addBuff(Buff2.create(Conditions.speed).setTurns(15)),
  },
  XP: {
    name: 'Potion of wisness',
    description: 'A potion that contains the wisdom of the ancien',
    effect: (t: Hero) => {
      const xp = SpellMaker.createSpell(SpellNames.XPSpell) as XPEffect;
      xp.cast(t);
    },
  },
  Rage: {
    name: 'Potion of rage',
    description:
      'A potion that makes you enter in a big rage. Your attacks are stronger but at the cost of your defense',
    effect: (t: Hero) => t.addBuff(Buff2.create(() => Conditions.rage({})).setTurns(15)),
  },
  Berkserk: {
    name: 'Potion of berserker',
    description:
      'A potion that transforms you into a powerfull Berserker for a while. When the effect ends, your body will need to rest.',
    effect: (t: Hero) => t.addBuff(Buff2.create(Conditions.berserk).setTurns(15)),
  },
  Curring: {
    name: 'Potion of curring',
    description: 'A potion that cure all the magic',
    effect: (t: Hero) => {
      const clean = SpellMaker.createSpell(SpellNames.CleaningSpell) as CleaningEffect;
      clean.cast(t);
    },
  },
};
