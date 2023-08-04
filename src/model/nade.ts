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
  targetPos: Pos3D
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

    const range = 16 * this.throwDistance
    const height = 300

    this.targetPos = {
      x: this.initialPos.x * (range + 1),
      y: this.pos.y,
      z: this.initialPos.z - Math.sin(Math.PI) * height
    }
  }

  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  update(dt: ms) {
    if (this.isFlying) {
      this.flightElapsed += dt



      const t = Math.min(this.flightElapsed / this.config.flightDuration, 1)
      this.pos.x = (this.initialPos.x * (1 + t * 16 * this.throwDistance))
      this.pos.z = this.initialPos.z - Math.sin(t * Math.PI) * 300


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
