import { gameBus } from "../../../eventBus/game-bus";
import { heroGainedXp, logPublished, sightUpdated } from "../../../events";
import { Hero } from "../../hero/hero";
import { Monster } from "../../monsters/monster";
import { Tile, TileVisibility } from "../../tilemap/tile";
import { matrixForEach } from "../../utils/matrix";
import { AbstractSpellShell } from "../abstract-spell-shell";
import { EffectTarget } from "../definitions";

export class KnowledgeSpell extends AbstractSpellShell {
    type = EffectTarget.None;

    cast() {
        matrixForEach<Tile>(this.world.getTilemap().tiles, (t: Tile) => {
            t.viewed = true;
            if (t.visibility !== TileVisibility.OnSight) t.setObscurity();
        });
        gameBus.publish(logPublished({level: 'success', data:'Yee see everything !'}));
        gameBus.publish(sightUpdated({}));
    }
}