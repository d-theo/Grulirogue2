import { gameBus } from "../../../eventBus/game-bus";
import { logPublished } from "../../../events";
import { Magic } from "../../entitybase/magic";
import { Hero } from "../../hero/hero";
import { Monster } from "../../monsters/monster";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";
import { SACRIFICE } from "../effect";

export class SacrificeSpell extends AbstractSpellShell {
    type = EffectTarget.Movable;

    cast(t: Hero|Monster) {
        const hero = this.world.getHero();
        const sacrifice = Math.floor(hero.basehp * 0.25);
        const curse = Math.floor(t.basehp * 0.5);
        const target = t;

        hero.addBuff({
            magic: new Magic({maxhp: -sacrifice}),
            turns: Infinity,
        });
        target.addBuff({
            magic: new Magic({maxhp: -curse}),
            turns: Infinity,
        });

        gameBus.publish(logPublished({level: 'danger', data: `You used a forbidden blood magic, hoping this sacrifice is worth the price...`}));
        t.takeDamage(curse, SACRIFICE);
        hero.takeDamage(sacrifice, SACRIFICE);
    }
}