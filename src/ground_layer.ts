import { Container, Sprite, Text } from "pixi.js";
import { getDisplayPos } from "./utils";

export const TILE_W = 128
export const TILE_H = 128

export class GroundLayer extends Container {
  constructor(w: number, h: number) {
    super()

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const tile = Sprite.from(`roadAsphalt_pavement_NW`)
        tile.anchor.set(0.5)

        const coordText = new Text(`${x},${y}`)
        coordText.anchor.set(0.5)
        tile.addChild(coordText)

        const pos = getDisplayPos({ x: x * TILE_W, y: y * TILE_H })
        tile.position.set(pos.x, pos.y)
        this.addChild(tile)
      }
    }
  }
}
