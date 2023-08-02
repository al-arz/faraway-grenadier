import { NADE_CONFIG, ms } from "../configs/nade_config";
import { GAME_EVENTS } from "../events";
import { HasPosition, Position } from "../model/game_location";
import { Nade, NadeType } from "../model/nade";
import { EventBus } from "../utils";

export class GrenadeThrower {
  initialPosition: Position
  isThrowingAllowed = true

  aimTimer: {
    active: boolean
    elapsed: ms,
    duration: ms
  }

  constructor(thrower: HasPosition) {
    this.initialPosition = thrower.pos

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

  // How do we get info about node explosion which should toggle flag
  // to allow throwing again?
  startAiming(n: NadeType) {
    this.aimTimer = {
      active: true,
      duration: NADE_CONFIG[n].aimDuration,
      elapsed: 0
    }
    console.log("Starting new throw")

  }

  launch(type: NadeType) {
    this.aimTimer.active = false
    const power = this.aimTimer.elapsed / this.aimTimer.duration
    console.log("Launching nade", power)
    const nade = new Nade(type)
    EventBus.emit(GAME_EVENTS.NADE_LAUNCHED, nade)
    nade.startFlying(this.initialPosition, power)
  }

  update(dt: ms) {
    if (this.aimTimer && this.aimTimer.active) {
      this.aimTimer.elapsed = Math.min(this.aimTimer.duration, this.aimTimer.elapsed + dt)
      /*
      this.aimTimer.elapsed += dt
      if (this.aimTimer.elapsed >= this.aimTimer.duration) {
        this.aimTimer.active = false
        this.aimTimer.elapsed = this.aimTimer.duration
      }
      */
    }

    // ToDo: should update automatically by corresponding system
    // Definitely not a thrower concern
    // if (this.nade) {
    //   this.nade.update(dt)
    // }
  }
}
