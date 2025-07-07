import { gameBus } from '../../infra/events/game-bus';
import { HealthReport, HealthStatus } from '../entitybase/health';
import { Entity } from '../entitybase/entity';
import { Monster } from '../entitybase/monsters/monster';
import { playerTookDammage, monsterTookDamage, monsterDead, heroGainedXp } from '../events';

export class DamageResolution {
  private report: HealthReport;

  constructor(
    public source: Entity,
    public target: Entity,
    public dmg: number,
    public cause: string
  ) {
    this.report = target.health.take(dmg);
    target.takeDamages(this);
  }

  heroTakesDamages() {
    gameBus.publish(
      playerTookDammage({
        monster: this.source as Monster,
        amount: this.report.amount,
        source: this.cause,
        baseHp: this.target.health.baseHp,
        currentHp: this.target.health.currentHp,
      })
    );
  }

  monsterTakesDamages(monster: Monster) {
    gameBus.publish(
      monsterTookDamage({
        monster: monster,
        amount: this.report.amount,
        baseHp: this.target.health.baseHp,
        currentHp: this.target.health.currentHp,
        externalSource: this.source,
      })
    );
    if (this.report.status === HealthStatus.Dead) {
      gameBus.publish(
        monsterDead({
          monster: monster,
        })
      );
      if (this.target.getAligment() === 'bad') {
        gameBus.publish(
          heroGainedXp({
            amount: monster.xp,
          })
        );
      }
    }
  }
}
