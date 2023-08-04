import { Container, Graphics } from "pixi.js";
import { PALETTE } from "../palette";

export class Target extends Container {
  constructor() {
    super()

    const g = new Graphics()
    g.lineStyle(2, PALETTE.YELLOW)
    g.drawCircle(0, 0, 90)
    g.lineStyle(2, PALETTE.ORANGE)
    g.drawCircle(0, 0, 30)
    g.lineStyle(2, PALETTE.RED)
    g.drawCircle(0, 0, 10)
    g.endFill()
    g.skew.x = Math.PI / 6
    g.angle = -30
    this.addChild(g)
  }
}
