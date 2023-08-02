import { ms } from "../configs/nade_config";
import { GAME_EVENTS } from "../events";
import { HasPosition, Position } from "../model/game_location";
import { Nade, NadeType } from "../model/nade";
import { EventBus } from "../utils";

export class GrenadeThrower {
  initialPosition: Position
  isThrowingAllowed = true

  aimDuration: ms
  nade: Nade

  constructor(thrower: HasPosition) {
    this.initialPosition = thrower.pos

    // ToDo: need to check if press was cancelled without button up
    // Otherwise we're softlocked in isThrowingAllowed = false
    EventBus.on(GAME_EVENTS.NADE_BUTTON_DOWN, (n: NadeType) => {
      // if (this.isThrowingAllowed) {
      this.startThrow(n)
      this.isThrowingAllowed = false
      // }
    })

    EventBus.on(GAME_EVENTS.NADE_BUTTON_UP, () => {
      // if (this.isThrowingAllowed) {
      this.launch(this.nade)
      // }
    })

    EventBus.on(GAME_EVENTS.NADE_EXPLODED, () => {
      this.isThrowingAllowed = true
    })
  }

  // How do we get info about node explosion which should toggle flag
  // to allow throwing again?
  startThrow(n: NadeType) {
    console.log("Starting new throw")
    this.nade = new Nade(n)
  }

  launch(nade: Nade) {
    console.log("Launching nade")
    EventBus.emit(GAME_EVENTS.NADE_LAUNCHED, nade)
    nade.startFlying(this.initialPosition)
  }

  update(dt: ms) {
    if (this.nade) {
      this.nade.update(dt)
    }
  }
}
