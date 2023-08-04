import { FLIGHT_DISTANCE_PER_POWER, FLIGHT_DURATION_PER_POWER, NADE_CONFIG, NadeConfig, ms } from "../configs/nade_config"
import { GAME_EVENTS } from "../events"
import { EventBus } from "../utils"
import { HasPosition, WorldPos } from "./game_location"

export type NadeType = "frag" | "he" | "thermal"

export class Nade implements HasPosition {
  type: NadeType
  config: NadeConfig

  initialPos: WorldPos
  targetPos: WorldPos
  position: WorldPos

  throwPower = 0
  flightElapsed: ms
  flightDuration: ms
  isFlying = false
  maxHeight = 0
  throwAngle = 0

  constructor(type: NadeType) {
    this.type = type
    this.config = Object.assign(NADE_CONFIG[type])
  }

  startFlying(pos: WorldPos, throwPower: number, angle: number) {
    this.isFlying = true
    this.throwPower = throwPower
    this.throwAngle = angle

    this.initialPos = { x: pos.x, y: pos.y, z: 0 }
    this.position = { x: pos.x, y: pos.y, z: 0 }
    this.targetPos = {
      x: this.initialPos.x + this.getThrowDistance(1),
      y: this.position.y,
      z: this.initialPos.z
    }

    this.flightElapsed = 0
    this.flightDuration = 2 * throwPower * FLIGHT_DURATION_PER_POWER * Math.sin(this.throwAngle)
    this.maxHeight = throwPower * throwPower * Math.sin(this.throwAngle) / 20
  }

  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t
  }

  getThrowDistance(t): number {
    return t * this.throwPower * FLIGHT_DISTANCE_PER_POWER * Math.cos(this.throwAngle)
  }

  getThrowHeight(t): number {
    return -this.maxHeight * Math.sin(t * Math.PI)
  }

  update(dt: ms) {
    if (this.isFlying) {
      this.flightElapsed += dt

      const t = Math.min(this.flightElapsed / this.flightDuration, 1)
      this.position.x = this.initialPos.x + this.getThrowDistance(t)
      this.position.z = this.initialPos.z + this.getThrowHeight(t)

      if (this.flightElapsed >= this.flightDuration) {
        this.isFlying = false
        this.explode()
      }
    }
  }

  explode() {
    EventBus.emit(GAME_EVENTS.NADE_EXPLODED, this)
  }
}
