import { CharacterKind } from "../configs/location_config";
import { GAME_EVENTS } from "../events";
import { EventBus } from "../utils";
import { WorldPos } from "./game_location";

export interface CharacterConfig {
  objectKind: "character"
  position: WorldPos
  characterKind: CharacterKind
  hp?: number
}

export class Character implements CharacterConfig {
  objectKind: "character"
  characterKind: CharacterKind
  position: WorldPos
  hp: number

  constructor(charConfig: CharacterConfig) {
    Object.assign(this, charConfig)
  }

  takeDamage(damage: number) {
    this.hp -= damage
    EventBus.emit(GAME_EVENTS.CHARACTER_HIT, this, damage)
    if (this.hp <= 0) {
      this.die()
    }
  }

  die() {
    EventBus.emit(GAME_EVENTS.CHARACTER_DIED, this)
  }
}
