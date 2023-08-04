import { Container, Sprite, Text } from "pixi.js";
import { DEBUG } from "../config";
import { isoFrom3D } from "../utils";

export const TILE_W = 128
export const TILE_H = 128

const GROUND_TILES_W = 10
const GROUND_TILES_H = 5

export class GroundLayer extends Container {
  tilesW: number
  tilesH: number

  constructor() {
    super()

    this.tilesW = GROUND_TILES_W
    this.tilesH = GROUND_TILES_H

    for (let y = 0; y < this.tilesH; y++) {
      for (let x = 0; x < this.tilesW; x++) {
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
