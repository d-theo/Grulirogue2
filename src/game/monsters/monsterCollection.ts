import { Monster } from "./monster";
import { Coordinate, equalsCoordinate } from "../utils/coordinate";
import { gameBus } from "../../eventBus/game-bus";
import { monsterDead } from "../../events";

export class MonsterCollection {
  monsters: Monster[] = [];

  monstersArray() {
    return this.monsters;
  }

  setMonsters(monsters: Monster[]) {
    this.monsters = monsters;
  }

  getAt(pos: Coordinate) {
    const m = this.monsters.find((m) => equalsCoordinate(m.pos, pos));
    if (!m) {
      return null;
    } else {
      return m;
    }
  }
  removeMonster(monster: Monster) {
    this.monsters = this.monsters.filter((m) => m.id !== monster.id);
  }
  update() {
    for (const m of this.monsters) {
      m.buffs.apply(m);
      m.update();
    }
    for (const m of this.monsters) {
      if (!m.enchants.getStuned()) {
        for (let i = 0; i < m.speed; i++) {
          m.play();
        }
      }
    }
  }
}
