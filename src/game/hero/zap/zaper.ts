import { CastPassiveSkill } from './../skills/cast';
import { logPublished } from './../../../events/log';
import { gameBus } from "../../../eventBus/game-bus";
import { IEffect, TeleportationSpell, EffectTarget } from '../../effects/spells';
import { EffectMaker, SpellNames } from '../../effects/effect';
import { Hero } from '../hero';
import { MessageResponse, MessageResponseStatus } from '../../utils/types';

export type ZapReport = Omit<Zap & {failChance: number}, 'cast'>;

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
    tryZap(zapLevel: number, zapName: string, target: any): MessageResponse {
        const zap = this.getZap(zapName);
        if (zap == null) {
            return {
                status: MessageResponseStatus.NotAllowed,
                data: "You don't know how to do that",
                timeSpent: 0,
            };
        }
        if (zap.energyNeeded > this.energy) {
            return {
                status: MessageResponseStatus.NotAllowed,
                data: "You don't have enought energy to do that",
                timeSpent: 0,
            };
        }

        this.energyLevel -= zap.energyNeeded;
        
        const fail = this.calcFail(zapLevel, zap);

        if (Math.random()*100 > fail) {
            zap.cast(target);
            return {
                status: MessageResponseStatus.Ok,
                timeSpent: 1,
            };
        } else {
            // fail
            gameBus.publish(logPublished({data: `Your ${zap.name} failed.`}));
            return {
                status: MessageResponseStatus.Error,
                timeSpent: 1,
            };
        }
    }

    private calcFail(zapLevel, zap): number {
        let fail = 0;
        if (zapLevel < zap.level) {
            fail = 70;
        } else {
            const delta = zap.level - zapLevel;
            fail = Math.max(0, 20 - (delta*10));
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
                targetType: zap.targetType,
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

export enum ZapName { 
    DimensionalJump = 'Dimensional jump'
};

export abstract class Zap {
    abstract level: number;
    abstract name: ZapName;
    abstract description: string;
    abstract effect: IEffect;
    abstract energyNeeded: number;
    cast(target) {
        this.effect.cast(target);
    }
    targetType(): EffectTarget {
        return this.effect.type;
    }
}

export class DashZap extends Zap {
    level = 1;
    name = ZapName.DimensionalJump;
    description = 'Accelerate time to dash foward';
    energyNeeded = 0;
    effect = EffectMaker.createSpell(SpellNames.Teleportation) as TeleportationSpell;
}