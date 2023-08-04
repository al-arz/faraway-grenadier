import { GAME_EVENTS } from "../events";
import { WorldPos } from "../model/game_location";
import { Nade, NadeType } from "../model/nade";
import { EventBus } from "../utils";

export type ms = number

const MAX_AIM_DURATION: ms = 1500

export class GrenadeThrower {
  initialPosition: WorldPos
  isThrowingAllowed = true

  aimTimer: {
    active: boolean
    elapsed: ms,
    duration: ms
  }

  constructor(pos: WorldPos) {
    this.initialPosition = pos

    // ToDo: need to check if press was cancelled without button up
    // Otherwise we're softlocked in isThrowingAllowed = false
    EventBus.on(GAME_EVENTS.NADE_BUTTON_DOWN, (n: NadeType) => {
      if (this.isThrowingAllowed) {
        this.startAiming(n)
        this.isThrowingAllowed = false
      }
    })

    EventBus.on(GAME_EVENTS.NADE_BUTTON_UP, (n: NadeType) => {
      if (this.aimTimer.active) {
        this.launch(n)
      }
    })

    EventBus.on(GAME_EVENTS.NADE_EXPLODED, () => {
      this.isThrowingAllowed = true
    })
  }

  startAiming(n: NadeType) {
    this.aimTimer = {
      active: true,
      duration: MAX_AIM_DURATION,
      elapsed: 0
    }
  }

  launch(type: NadeType) {
    this.aimTimer.active = false
    const nade = new Nade(type)
    const powerFraction = Math.min(1, this.aimTimer.elapsed / this.aimTimer.duration)
    const throwPower = powerFraction * nade.config.maxThrowPower
    nade.startFlying(this.initialPosition, throwPower, Math.PI / 3)
    EventBus.emit(GAME_EVENTS.NADE_LAUNCHED, nade)
  }

  update(dt: ms) {
    if (this.aimTimer && this.aimTimer.active) {
      this.aimTimer.elapsed = Math.min(this.aimTimer.duration, this.aimTimer.elapsed + dt)
    }
  }
}
