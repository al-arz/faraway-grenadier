import { TILE_H, TILE_W } from "../ground_layer"
import { WorldPos } from "../model/game_location"
import { ObstacleType } from "../model/obstacle"

export type LocationObjectType = "character" | "obstacle"

export type CharConfig = {
  type: LocationObjectType
  position: WorldPos
}

export type ObstacleConfig = {
  type: LocationObjectType
  position: WorldPos
  obstacleType: ObstacleType
}

export type LocationObjectConfig = CharConfig | ObstacleConfig

export type LocationConfig = { objects: LocationObjectConfig[] }

export const LOCATION_CONFIG: LocationConfig = {
  objects: [
    {
      type: "character",
      position: { x: TILE_W * 2, y: TILE_H * 2 }
    },
    {
      type: "obstacle",
      obstacleType: "a",
      position: { x: TILE_W * 3, y: TILE_H * 2 }
    },
    {
      type: "obstacle",
      obstacleType: "b",
      position: { x: TILE_W * 6, y: TILE_H * 2 }
    },
    {
      type: "character",
      position: { x: TILE_W * 7, y: TILE_H * 2 }
    },
  ]
}
