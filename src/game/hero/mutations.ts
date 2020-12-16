import { Hero } from "./hero";

export class MutationBase {
    mutations: Mutation[];
    constructor(private hero: Hero) {}
    apply(mutation: Mutation) {
        mutation.applyTo(this.hero);
        this.mutations.push(mutation);
    }
    hasMutation(type): boolean {
        return false;
    }
}

export abstract class Mutation {
    abstract description: string;
    abstract applyTo(hero: Hero);
}

export class ScaleMutation extends Mutation {
    public description = 'You have scales on your body';
    applyTo(hero: Hero) {
        hero.armour.baseAbsorb += 1;
    }
}

export class GlassBonesMutation extends Mutation {
    public description = 'Your have fragile bones';
    applyTo(hero: Hero) {
        hero.armour.baseAbsorb -= 2;
    }
}

export class TimeTravelSicknessMutation extends Mutation {
    public description = 'Your have time travel sickness, each time travel inflict your damages';
    applyTo(hero: Hero) {
        //
    }
}

export class FatMutation extends Mutation {
    public description = 'You feel heavy';
    applyTo(hero: Hero) {
        // more hp
        // chance to move slower for 5 turns randomly
    }
}

export class CleverMutation extends Mutation {
    public description = 'Your wiseness makes you more attentive to magic items';
    applyTo(hero: Hero) {
        //
    }
}

export class StressedMutation extends Mutation {
    public description = 'You are nervous when fighting';
    applyTo(hero: Hero) {
        // chance to pass your turn after attacking
    }
}

export class PotionAddictMutation extends Mutation {
    public description = 'You drunk too much potion and are less effective on you';
    applyTo(hero: Hero) {
        //
    }
}

export class VigorousMutation extends Mutation {
    public description = 'You feel invincible';
    applyTo(hero: Hero) {
        //poison resistance resistance
    }
}

export class HealthyMutation extends Mutation {
    public description = 'You feel energetic';
    applyTo(hero: Hero) {
        hero.health.getStrongerByHp(10);
    }
}

export class ColdBloodedMutation extends Mutation {
    public description = 'You stay focus on the fight';
    applyTo(hero: Hero) {
        hero.precision += 0.1
    }
}

export class HornMutation extends Mutation {
    public description = 'You have a horn on top of your head';
    applyTo(hero: Hero) {
        // débloque un skill
    }
}

export class MuscleMutation extends Mutation {
    public description = 'Your muscle are going out of control, you are twice as slow but twice as powerfull';
    applyTo(hero: Hero) {
        
    }
}

export class SoulHunterMutation extends Mutation {
    public description = 'You are driven by the blood of your enemies';
    applyTo(hero: Hero) {
        // vampiric 
    }
}