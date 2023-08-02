import { GAME_EVENTS } from "../events";
import { EventBus } from "../utils";
import { HasPosition, Position } from "./game_location";

export class Character implements HasPosition {
  type: "character"
  pos: Position
  hp: number

  constructor(initialPosition: Position) {
    this.type = "character"
    this.pos = initialPosition
    this.hp = 100
  }

  takeDamage(damage: number) {
    this.hp -= damage
    EventBus.emit(GAME_EVENTS.CHARACTER_HIT, this, damage)
    console.log(`character at ${this.pos.x}, ${this.pos.y} took ${damage} damage. HP left: ${this.hp}`)
    if (this.hp <= 0) {
      this.die()
    }
  }

  die() {
    EventBus.emit(GAME_EVENTS.CHARACTER_DIED, this)
  }
}
