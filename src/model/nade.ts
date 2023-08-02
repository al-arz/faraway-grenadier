import { NADE_CONFIG, NadeConfig } from "../configs/nade_config"
import { GAME_EVENTS } from "../events"
import { EventBus } from "../utils"
import { HasPosition, Position } from "./game_location"

export type NadeType = "frag" | "he" | "thermal"

export const NADE_ICON_KEYS: Record<NadeType, string> = {
  frag: "frag",
  he: "he",
  thermal: "thermal"
}

export class Nade implements HasPosition {
  type: NadeType
  initialPos: Position
  pos: Position
  config: NadeConfig
  flightElapsedMS: number
  isFlying = false

  constructor(type: NadeType) {
    this.type = type
    this.config = Object.assign(NADE_CONFIG[type])
  }

  startFlying(pos: Position) {
    // ToDo: reuse points
    this.initialPos = { x: pos.x, y: pos.y }
    this.pos = { x: pos.x, y: pos.y }
    this.flightElapsedMS = 0
    this.isFlying = true
  }

  update(ms: number) {
    if (this.isFlying) {
      this.flightElapsedMS += ms

      const range = 7.5
      const height = 300

      const t = Math.min(this.flightElapsedMS / this.config.flightDurationMS, 1)
      this.pos.x = (this.initialPos.x * (1 + t * range))
      this.pos.y = this.initialPos.y - Math.sin(t * Math.PI) * height


      if (this.flightElapsedMS >= this.config.flightDurationMS) {
        this.isFlying = false
        this.explode()
      }
    }
  }

  explode() {
    console.log(`${this.type} nade exploded`)
    EventBus.emit(GAME_EVENTS.NADE_EXPLODED, this)
  }
}
