import { Container, Sprite, Text } from "pixi.js";
import { DEBUG } from "../config";
import { isoFrom3D } from "../utils";

export const TILE_W = 128
export const TILE_H = 128

export class GroundLayer extends Container {
  constructor(w: number, h: number) {
    super()

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const tile = Sprite.from(`pavement`)
        tile.anchor.set(0.5)

        if (DEBUG) {
          const coordText = new Text(`${x},${y}`)
          coordText.anchor.set(0.5)
          tile.addChild(coordText)
        }

        const pos = isoFrom3D({ x: x * TILE_W, y: y * TILE_H, z: 0 })
        tile.position.set(pos.x, pos.y)
        this.addChild(tile)
      }
    }
  }
}
