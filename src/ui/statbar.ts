import { Container, Graphics } from "pixi.js";
import { PALETTE } from "../palette";

export class StatBar extends Container {
  maxValue: number
  gfx: Graphics
  length: number
  constructor(maxValue: number, length: number) {
    super()

    this.maxValue = maxValue
    this.length = length

    this.gfx = new Graphics()
    this.gfx.beginFill(PALETTE.RED)
    this.gfx.drawRect(0, 0, 1, 10)
    this.addChild(this.gfx)

    this.update
  }

  update(value: number) {
    this.gfx.width = this.length * value / this.maxValue
  }
}
