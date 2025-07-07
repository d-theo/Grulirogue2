import { Hero } from '../hero/hero';
import { Monster } from '../entitybase/monsters/monster';
import { EnchantInteractionRules } from '../../content/conditions/solver';

export class EnchantSolver {
  constructor(private entity: Hero | Monster) {}

  solve() {
    for (let rule of EnchantInteractionRules) {
      if (rule.condition(this.entity)) {
        rule.effect(this.entity);
      }
    }
  }
}
