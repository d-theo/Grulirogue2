import { gameBus } from "../../../eventBus/game-bus";
import { playerMoved, playerHealed } from "../../../events";
import { sightHasChanged } from "../../../events/sight-has-changed";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class FlashbackSpell extends AbstractSpellShell  {
    type = EffectTarget.Hero;

    constructor() {
        super();
        console.log(this.world);
    }

    cast() {
        const state = this.world.getHero().pastStates[0];
        this.world.getHero().pos = state.pos;
        this.world.getHero()['health']['currentHp'] = state.hp;
        gameBus.publish(playerMoved({}));
        gameBus.publish(sightHasChanged({}));
        gameBus.publish(playerHealed({baseHp:this.world.getHero().maxhp, currentHp: state.hp}));
    }
}