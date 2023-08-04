import { TILE_H, TILE_W } from "../ground_layer"
import { CharacterConfig } from "../model/character"
import { ObstacleConfig } from "../model/obstacle"

export type LocationObjectType = "character" | "obstacle"

export const OBSTACLE_GFX = {
  barrier_A: "barrier_A",
  barrier_B: "barrier_B",
} as const

export type CharacterKind = "playable" | "enemy"

export type ObstacleKind = keyof typeof OBSTACLE_GFX;

export type LocationObjectConfig = CharacterConfig | ObstacleConfig

export type LocationConfig = { objects: LocationObjectConfig[] }

export const LOCATION_CONFIG: LocationConfig = {
  objects: [
    {
      objectKind: "character",
      characterKind: "playable",
      position: { x: TILE_W * 2, y: TILE_H * 2, z: 0 }
    },
    {
      objectKind: "obstacle",
      obstacleKind: "barrier_A",
      position: { x: TILE_W * 3, y: TILE_H * 2, z: 0 }
    },
    {
      objectKind: "obstacle",
      obstacleKind: "barrier_B",
      position: { x: TILE_W * 6, y: TILE_H * 2, z: 0 }
    },
    {
      objectKind: "character",
      characterKind: "enemy",
      hp: 100,
      position: { x: TILE_W * 7, y: TILE_H * 2, z: 0 }
    },
  ]
}
