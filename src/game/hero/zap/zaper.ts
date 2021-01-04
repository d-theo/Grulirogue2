import { CastPassiveSkill } from './../skills/cast';
import { logPublished } from './../../../events/log';
import { gameBus } from "../../../eventBus/game-bus";
import { IEffect } from '../../effects/spells';
import { EffectMaker, SpellNames } from '../../effects/effect';
import { Hero } from '../hero';

export type ZapReport = Zap & {failChance: number};

export class Zapper {
    private stored: Zap[] = [];
    private storage: ZapStore = new ZapStore();
    private energyLevel: number = 10;
    private energyRegenerationRate = 15;
    private energyPerTick = 1;
    private turn = 0;

    private inited = false;

    constructor(private readonly hero: Hero) {}
    init() {
        if (this.inited) {return}
        else {
            this.stored.push(new DashZap());
            this.inited = true;
        }
    }
    transfert(name: string) {
        if (! this.hasZap(name)) {
            const z: Zap = this.storage.get(name);
            this.stored.push(z);
            this.storage.deleteOne(name);
        }
    }
    erase(name: string) {
        this.stored = this.stored.filter(z => z.name !== name);
    }
    update() {
        this.turn += 1;
        if (this.turn % this.energyRegenerationRate === 0) {
            this.energyLevel += this.energyPerTick;
        }
    }
    hasZap(name: string) {
        return this.stored.find(z => z.name === name) !== null;
    }
    tryZap(zapLevel: number, zapName: string, target: any) {
        const zap = this.getZap(zapName);
        if (zap == null) {
            return;
        }
        if (zap.energyNeeded > this.energy) {
            return;
        }

        this.energyLevel -= zap.energyNeeded;
        
        const fail = this.calcFail(zapLevel, zap);

        if (Math.random()*100 > fail) {
            zap.cast(target);
        } else {
            // fail
            gameBus.publish(logPublished({data: `Your ${zap.name} failed.`}));
        }
    }

    private calcFail(zapLevel, zap): number {
        let fail = 0;
        if (zapLevel < zap.level) {
            fail = 100;
        } else {
            const delta = zap.level - zapLevel;
            fail = Math.max(0, 50 - (delta*10));
        }
        return fail;
    }

    getZap(name: string): Zap {
        return this.stored.find(z => z.name === name);
    }
    get energy () {
        return this.energyLevel;
    }

    report(): ZapReport[] {
        this.init();
        return this.stored.map(zap => {
            return {
                ...zap,
                failChance: this.calcFail(this.hero.skills.levelOfSkill(CastPassiveSkill), zap)}
        });
    }
}

export class ZapStore  {
    zaps = {};
    get(name: string): Zap {
        return this.zaps[name];
    }
    addMany(zaps: Zap[]) {
        for (let z of zaps) {
            if (! this.zaps[z.name]) {
                this.zaps[z.name] = z;
            }
        }
    }
    deleteOne(name: string) {
        delete this.zaps[name];
    }
}

export abstract class Zap {
    abstract level: number;
    abstract name: string;
    abstract description: string;
    abstract effect: IEffect;
    abstract energyNeeded: number;
    cast(target) {
        this.effect.cast(target);
    }
}

export class DashZap extends Zap {
    level = 3;
    name = 'Dimensional jump';
    description = 'Accelerate time to dash foward';
    energyNeeded = 10;
    effect = EffectMaker.createSpell(SpellNames.Teleportation);
}