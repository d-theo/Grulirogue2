import { EffectTarget } from "./spells";
import { WorldEffect } from "./world-effect";

export abstract class AbstractSpellShell {
    private static _world: WorldEffect;
    abstract type: EffectTarget;
    protected world: WorldEffect; // todo : private and just have some public methods
    constructor() {
        this.world = AbstractSpellShell._world;
    }
    static bindOnce(game: WorldEffect) {
        AbstractSpellShell._world = game;
    }
    abstract cast(x: any);
}