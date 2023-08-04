import { Container, Graphics, Sprite } from "pixi.js";
import { NADE_ICONS } from "../configs/nade_config";
import { GAME_EVENTS } from "../events";
import { NadeType } from "../model/nade";
import { PALETTE } from "../palette";
import { EventBus } from "../utils";

type NadeButton = Sprite

const BTN_W = 100

export class NadesUI extends Container {
  constructor(nades: NadeType[]) {
    super()

    nades.forEach((nadeType, i) => {
      const btn = this.addChild(this._getNadeButton(nadeType))
      btn.position.set(10 + i * (BTN_W + 20), 10)
      this.addChild(btn)
    })
  }

  private _getNadeButton(n: NadeType): NadeButton {
    const btn = new Sprite()

    const g = new Graphics()
    g.beginFill(PALETTE.DARKGRAY)
    g.drawRect(0, 0, BTN_W, 80)
    g.endFill()

    const textureKey = NADE_ICONS[n]
    const icon = Sprite.from(textureKey)
    icon.anchor.set(0.5)
    icon.scale.set(3)
    icon.position.set(g.width / 2, g.height / 2)

    btn.addChild(g)
    btn.addChild(icon)
    btn.eventMode = "static"
    let pressed = false

    btn.on("pointerdown", () => {
      EventBus.emit(GAME_EVENTS.NADE_BUTTON_DOWN, n)
      pressed = true
    })
    btn.on("pointerup", () => {
      if (pressed) {
        EventBus.emit(GAME_EVENTS.NADE_BUTTON_UP, n)
      }
    })
    return btn
  }
}
