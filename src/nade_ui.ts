import { ColorSource, Container, Graphics, Sprite } from "pixi.js";
import { GAME_EVENTS } from "./events";
import { NadeType } from "./model/nade";
import { PALETTE } from "./palette";
import { EventBus } from "./utils";

type NadeButton = Sprite

const BTN_W = 100
export const NADE_COLORS: Record<NadeType, ColorSource> =
{
  frag: PALETTE.GREEN,
  he: PALETTE.EGGPLANT,
  thermal: PALETTE.ORANGE
}

export class NadeUI extends Container {
  constructor(nades: NadeType[]) {
    super()

    nades.forEach((nadeType, i) => {
      const btn = this.addChild(this._getNadeButton(nadeType))
      btn.position.set(10 + i * (BTN_W + 20), 10)
      this.addChild(btn)
    })
  }


  private _getNadeButton(n: NadeType): NadeButton {
    // const textureKey = NADE_ICON_KEYS[n]
    // const btn = Sprite.from(textureKey)

    const btn = new Sprite()
    const g = new Graphics()
    g.beginFill(NADE_COLORS[n])
    g.drawRoundedRect(0, 0, BTN_W, 40, 5)
    g.endFill()
    btn.addChild(g)
    btn.eventMode = "static"
    let pressed = false
    btn.on("pointerdown", () => {
      console.log(`${n} grenade button pressed`)
      EventBus.emit(GAME_EVENTS.NADE_BUTTON_DOWN, n)
      pressed = true
    })
    btn.on("pointerup", () => {
      if (pressed) {
        console.log(`${n} grenade button released`)
        EventBus.emit(GAME_EVENTS.NADE_BUTTON_UP, n)
      }
    })
    return btn
  }
}
