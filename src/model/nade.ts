import { ms, NADE_CONFIG, NadeConfig } from "../configs/nade_config"
import { GAME_EVENTS } from "../events"
import { EventBus } from "../utils"
import { HasPosition, WorldPos } from "./game_location"

export type NadeType = "frag" | "he" | "thermal"

export type Pos3D = { x: number, y: number, z: number }

export const NADE_ICON_KEYS = {
  frag: "frag",
  he: "he",
  thermal: "molotov"
} as const

export class Nade implements HasPosition {
  type: NadeType
  initialPos: Pos3D
  pos: Pos3D
  throwDistance = 0
  config: NadeConfig
  flightElapsed: ms
  isFlying = false

  constructor(type: NadeType) {
    this.type = type
    this.config = Object.assign(NADE_CONFIG[type])
  }

  startFlying(pos: WorldPos, throwDistance: number) {
    // ToDo: reuse points
    this.initialPos = { x: pos.x, y: pos.y, z: 0 }
    this.pos = { x: pos.x, y: pos.y, z: 0 }
    this.flightElapsed = 0
    this.isFlying = true
    this.throwDistance = throwDistance
  }

  update(dt: ms) {
    if (this.isFlying) {
      this.flightElapsed += dt

      const range = 16 * this.throwDistance
      const height = 300

      const t = Math.min(this.flightElapsed / this.config.flightDuration, 1)
      this.pos.x = (this.initialPos.x * (1 + t * range))
      this.pos.z = this.initialPos.z - Math.sin(t * Math.PI) * height


      if (this.flightElapsed >= this.config.flightDuration) {
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
