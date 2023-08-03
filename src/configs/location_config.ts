import { TILE_H, TILE_W } from "../ground_layer"
import { WorldPos } from "../model/game_location"

export type LocationObjectType = "character" | "obstacle"

export type LocationObjectConfig = {
  type: LocationObjectType
  position: WorldPos
}

export type LocationConfig = { objects: LocationObjectConfig[] }

export const LOCATION_CONFIG: LocationConfig = {
  objects: [
    {
      type: "character",
      position: { x: TILE_W * 1, y: TILE_H * 2 }
    },
    {
      type: "obstacle",
      position: { x: TILE_W * 3, y: TILE_H * 2 }
    },
    {
      type: "obstacle",
      position: { x: TILE_W * 6, y: TILE_H * 2 }
    },
    {
      type: "character",
      position: { x: TILE_W * 8, y: TILE_H * 2 }
    },
  ]
}
