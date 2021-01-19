import { gameBus } from "../../../eventBus/game-bus";
import { monsterSpawned } from "../../../events";
import { Bestiaire } from "../../monsters/bestiaire";
import { Monster } from "../../monsters/monster";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class SummonWeakSpell extends AbstractSpellShell  {
    type = EffectTarget.None;

    cast() {
        const pos = this.world.getHero().pos;
        const mobs = [Bestiaire.Greece.Bat, Bestiaire.Greece.Rat, Bestiaire.Greece.Rat];
        for (let i = 0; i < 3; i++) {
            const posMob = this.world.nearestEmptyTileFrom(pos);
            const friend = Monster
                .makeMonster({...mobs[i], pos: {x: posMob.x, y: posMob.y}})
                .setAligment('good');
            this.world.addMonster(friend);
            gameBus.publish(monsterSpawned({monster: friend}));
        }
    }
}