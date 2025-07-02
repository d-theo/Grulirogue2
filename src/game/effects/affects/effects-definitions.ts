import { gameBus } from "../../../eventBus/game-bus";
import { itemEquiped, logPublished, playerHealed } from "../../../events";
import { DamageResolution } from "../../fight/damages";
import { Hero } from "../../hero/hero";
import { SkillNames } from "../../hero/hero-skills";
import { Monster } from "../../monsters/monster";
import { pickInRange } from "../../utils/random";
import { NullFunc } from "../affects";

export interface EffectLifecycle {
    start?: (entity: Hero | Monster) => void;
    tick?: (entity: Hero | Monster) => void;
    end?: (entity: Hero | Monster) => void;
    tags?: string;
}

export const effectDefinitions: Record<string, () => EffectLifecycle> = {
    thicc: () => ({
        start: (t: Hero | Monster) => {
            t.armour.modifyAbsorb(5);
            t.speed = t.speed * 2;
            t.enchants.setAbsorb(true);
            gameBus.publish(itemEquiped({ armour: t.armour }));
        },
        end: (t: Hero | Monster) => {
            t.armour.modifyAbsorb(-5);
            t.speed = t.speed / 2;
            t.enchants.setAbsorb(false);
            gameBus.publish(itemEquiped({ armour: t.armour }));
        },
        tags: 'thicc'
    }),
    heal: () => ({
        tick: (t: Hero) => {
            let bonus = pickInRange('10-20');
            bonus += 10 * t.heroSkills.getSkillLevel(SkillNames.Alchemist);
            t.health.take(-bonus);
            gameBus.publish(playerHealed({
                baseHp: t.health.baseHp,
                currentHp: t.health.currentHp
            }));
        },
        start: null,
        end: NullFunc,
        tags: 'heal'
    }),
    poison: () => ({
        start: (t: Hero | Monster) => {
            gameBus.publish(logPublished({ level: 'danger', data: `${t.name} feels poison in his veins` }));
            t.enchants.setPoisoned(true)
        },
        tick: (t: Hero | Monster) => {
            new DamageResolution(null, t, 2, 'poisoning');
        },
        end: (t: Hero | Monster) => t.enchants.setPoisoned(false),
        tags: 'poison'
    })
};